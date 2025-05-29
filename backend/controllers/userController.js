const User = require('../models/User'); // Ensure path is correct
const ExpressError = require('../utils/ExpressError'); // Ensure path is correct
const { Webhook } = require('svix');

// GET current authenticated user's details (from our DB)
module.exports.getCurrentUser = async (req, res) => {
    // req.user should have been populated by the syncUserWithDb middleware
    if (!req.user || !req.user._id) {
        // This should ideally not happen if syncUserWithDb ran successfully after requireAuth
        return res.status(404).json({ message: "Authenticated user not found in local database." });
    }
    // Return the user object attached by syncUserWithDb
    // You can choose to select or exclude fields if necessary, e.g., to hide sensitive info
    const userToSend = {
        _id: req.user._id,
        clerkId: req.user.clerkId,
        username: req.user.username,
        email: req.user.email,
        profileImageUrl: req.user.profileImageUrl,
        role: req.user.role,
        createdAt: req.user.createdAt, // Optional: send createdAt
    };
    res.status(200).json(userToSend);
};

// Handle Clerk Webhook for user creation/updates/deletions
module.exports.handleClerkWebhook = async (req, res, next) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("FATAL ERROR: CLERK_WEBHOOK_SIGNING_SECRET is not set in .env");
        // Return 200 to Clerk to acknowledge receipt and prevent retries for a server misconfiguration.
        // Log this server-side for immediate admin attention.
        return res.status(200).json({ error: "Webhook secret not configured on server." });
    }

    // Svix headers for verification
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.warn("Webhook request from Clerk missing Svix headers.");
        return res.status(400).json({ error: "Missing Svix verification headers." });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
    // req.body is a Buffer here because we used express.raw() in server.js for this route
    const payloadString = req.body.toString(); 

    try {
        evt = wh.verify(payloadString, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Error verifying Clerk webhook signature:", err.message);
        return res.status(400).json({ 'error': "Webhook signature verification failed: " + err.message });
    }

    const { id: clerkId, ...attributes } = evt.data; // Clerk User ID and other attributes
    const eventType = evt.type;
    console.log(`Received Clerk webhook: Type='${eventType}', ClerkUserID='${clerkId}'`);

    try {
        let user;
        let primaryEmailObject;
        let primaryEmail;

        if (attributes.email_addresses && attributes.email_addresses.length > 0) {
            primaryEmailObject = attributes.email_addresses.find(
                (emailEntry) => emailEntry.id === attributes.primary_email_address_id
            );
            primaryEmail = primaryEmailObject ? primaryEmailObject.email_address : attributes.email_addresses[0].email_address; // Fallback to first email
        }


        switch (eventType) {
            case 'user.created':
                user = await User.findOne({ clerkId: clerkId });
                if (user) {
                    console.log(`Webhook: User ${clerkId} (created event) already exists in DB. Ensuring data consistency.`);
                    // Optionally update fields if they might have changed between Clerk creation and webhook processing
                    user.email = primaryEmail || user.email;
                    user.username = attributes.username || attributes.first_name || user.username || `user_${clerkId.slice(-6)}`;
                    user.profileImageUrl = attributes.image_url || attributes.profile_image_url || user.profileImageUrl || '';
                    await user.save();
                } else {
                    user = await User.create({
                        clerkId: clerkId,
                        email: primaryEmail || `${clerkId.slice(0,10)}@gostays-temp.com`, // Ensure email is always set
                        username: attributes.username || attributes.first_name || `user_${clerkId.slice(-6)}`,
                        profileImageUrl: attributes.image_url || attributes.profile_image_url || '',
                        // role: 'user' // Default is set in schema
                    });
                    console.log(`Webhook: User ${clerkId} created in DB: ${user.username}`);
                }
                break;

            case 'user.updated':
                const updateData = {};
                if (primaryEmail) updateData.email = primaryEmail;
                if (attributes.username) updateData.username = attributes.username;
                else if (attributes.first_name) updateData.username = attributes.first_name; // Fallback to first_name if username cleared

                if (attributes.image_url !== undefined) updateData.profileImageUrl = attributes.image_url; // Clerk uses image_url
                else if (attributes.profile_image_url !== undefined) updateData.profileImageUrl = attributes.profile_image_url; // Older SDKs might use this

                if (Object.keys(updateData).length > 0) {
                    user = await User.findOneAndUpdate({ clerkId: clerkId },
                        { $set: updateData },
                        { new: true, upsert: false } // Don't create if not found; should exist
                    );
                    if (user) {
                        console.log(`Webhook: User ${clerkId} updated in DB: ${user.username}`);
                    } else {
                        console.warn(`Webhook: User ${clerkId} not found for update. This might indicate a sync issue.`);
                        // Optionally, create the user here if desired for robustness, similar to user.created
                    }
                } else {
                    console.log(`Webhook: User ${clerkId} update event received, but no relevant fields changed for local DB.`);
                }
                break;

            case 'user.deleted':
                user = await User.findOneAndDelete({ clerkId: clerkId });
                if (user) {
                    console.log(`Webhook: User ${clerkId} (DB ID: ${user._id}) deleted from DB.`);
                    // TODO: Implement application-specific logic for when a user is deleted.
                    // e.g., anonymize their listings/reviews, or delete them if required by privacy policies.
                    // Example: await Listing.updateMany({ owner: user._id }, { $set: { owner: null } });
                } else {
                     console.warn(`Webhook: User ${clerkId} not found in DB for deletion.`);
                }
                break;

            default:
                console.log(`Webhook: Unhandled event type '${eventType}' for Clerk User ID '${clerkId}'.`);
        }
        res.status(200).json({ success: true, message: "Webhook processed successfully." });
    } catch (dbError) {
        console.error(`Webhook DB Error: Failed to process event '${eventType}' for Clerk User ID '${clerkId}':`, dbError);
        // Important: Respond with 200 to Clerk to prevent retries for persistent DB issues.
        // Log thoroughly for investigation.
        res.status(200).json({ success: false, message: "Webhook received, but an internal database error occurred during processing." });
    }
};