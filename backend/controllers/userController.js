const User = require("../models/User.js");
const ExpressError = require("../utils/ExpressError.js");
const { Webhook } = require('svix'); // For Clerk webhook verification

// GET current authenticated user's details (from our DB)
module.exports.getCurrentUser = async (req, res) => {
    // req.user should be populated by clerkAuth.requireAuth + clerkAuth.syncUserWithDb
    if (!req.user || !req.user._id) {
        // This case should ideally be caught by requireAuth or syncUserWithDb,
        // but good to have a fallback.
        return res.status(401).json({ message: "User not authenticated or not found in DB." });
    }
    // Fetch fresh data to ensure it's up-to-date, or just return req.user
    const user = await User.findById(req.user._id).select('-clerkId'); // Exclude clerkId if not needed by client
    
    if (!user) {
        // This would mean user was in req.user but somehow not in DB anymore, very unlikely if syncUserWithDb worked.
        return res.status(404).json({ message: "User details not found in database."});
    }
    res.status(200).json(user);
};

// Handle Clerk Webhook for user creation/updates/deletions
module.exports.handleClerkWebhook = async (req, res, next) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("Clerk webhook signing secret (CLERK_WEBHOOK_SIGNING_SECRET) is not configured.");
        // It's important to return 200 to Clerk even if we can't process due to config,
        // to prevent it from retrying indefinitely for a non-transient error on our side.
        // Log this issue for admin attention.
        return res.status(200).json({ error: "Webhook secret not configured on server." });
    }

    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.warn("Webhook request missing Svix headers.");
        return res.status(400).json({ error: "Missing Svix verification headers." });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
    const payload = JSON.stringify(req.body); // req.body is already parsed by express.raw

    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Error verifying Clerk webhook signature:", err.message);
        return res.status(400).json({ 'error': "Webhook signature verification failed: " + err.message });
    }

    const { id: clerkId, ...attributes } = evt.data;
    const eventType = evt.type;
    console.log(`Received Clerk webhook: Type='${eventType}', ClerkUserID='${clerkId}'`);

    try {
        let user;
        switch (eventType) {
            case 'user.created':
                user = await User.findOne({ clerkId: clerkId });
                if (user) {
                    console.log(`Webhook: User ${clerkId} already exists. Updating potentially missing info.`);
                    user.email = attributes.email_addresses?.find(e => e.id === attributes.primary_email_address_id)?.email_address || user.email;
                    user.username = attributes.username || attributes.first_name || user.username;
                    user.profileImageUrl = attributes.profile_image_url || attributes.image_url || user.profileImageUrl;
                    await user.save();
                } else {
                    await User.create({
                        clerkId: clerkId,
                        email: attributes.email_addresses?.find(e => e.id === attributes.primary_email_address_id)?.email_address,
                        username: attributes.username || attributes.first_name || `user_${clerkId.slice(-6)}`,
                        profileImageUrl: attributes.profile_image_url || attributes.image_url,
                        // role: 'user', // Default role
                    });
                    console.log(`Webhook: User ${clerkId} created.`);
                }
                break;
            case 'user.updated':
                const updateData = {
                    email: attributes.email_addresses?.find(e => e.id === attributes.primary_email_address_id)?.email_address,
                    username: attributes.username || attributes.first_name,
                    profileImageUrl: attributes.profile_image_url || attributes.image_url,
                };
                // Filter out undefined values to prevent overwriting existing fields with undefined
                const filteredUpdateData = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== undefined));

                user = await User.findOneAndUpdate({ clerkId: clerkId },
                    { $set: filteredUpdateData },
                    { new: true, upsert: false } // Don't upsert; user should exist. new:true returns updated doc.
                );
                if (user) {
                    console.log(`Webhook: User ${clerkId} updated.`);
                } else {
                    console.warn(`Webhook: User ${clerkId} not found for update. This might indicate a sync issue or a new user not yet created by other means.`);
                    // Optionally, create the user here if it's acceptable for your logic
                    // await User.create({ clerkId: clerkId, ...filteredUpdateData, /* other required fields */ });
                }
                break;
            case 'user.deleted':
                user = await User.findOneAndDelete({ clerkId: clerkId });
                if (user) {
                    console.log(`Webhook: User ${clerkId} (DB ID: ${user._id}) deleted.`);
                    // TODO: Implement application-specific logic for when a user is deleted.
                    // E.g., anonymize their listings/reviews, or delete them if required by privacy policies.
                    // await Listing.updateMany({ owner: user._id }, { $set: { owner: null } }); // Example: Anonymize listings
                } else {
                     console.warn(`Webhook: User ${clerkId} not found for deletion.`);
                }
                break;
            default:
                console.log(`Webhook: Unhandled event type '${eventType}'.`);
        }
        // Acknowledge receipt of the webhook
        res.status(200).json({ message: "Webhook processed successfully." });
    } catch (dbError) {
        console.error(`Webhook: Database error processing event '${eventType}' for Clerk User ID '${clerkId}':`, dbError);
        // Respond with 200 to Clerk to prevent retries for what might be persistent DB issues on our end.
        // Log thoroughly for investigation.
        res.status(200).json({ message: "Webhook received, but an internal database error occurred during processing." });
    }
};