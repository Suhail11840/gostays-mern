import React from 'react';
import { FiShield, FiUsers, FiList, FiSettings } from 'react-icons/fi';

// Example: Admin Sidebar Navigation
const AdminSidebar = () => {
  // In a real app, these links would use react-router-dom's NavLink
  const navItems = [
    { name: 'Overview', icon: FiShield, path: '/admin/overview' },
    { name: 'Manage Users', icon: FiUsers, path: '/admin/users' },
    { name: 'Manage Listings', icon: FiList, path: '/admin/listings' },
    { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-secondary text-neutral-lightest p-6 space-y-4 rounded-r-xl shadow-lg">
      <h2 className="text-2xl font-display font-semibold text-white mb-6">Admin Panel</h2>
      <nav>
        <ul>
          {navItems.map(item => (
            <li key={item.name}>
              <a 
                href={item.path} // Replace with NavLink and proper routing
                className="flex items-center py-2.5 px-4 rounded-lg hover:bg-secondary-light hover:text-white transition-colors duration-200"
                // activeClassName="bg-primary text-white" // For NavLink
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};


const AdminDashboardPage = () => {
  // This is a placeholder. A real admin dashboard would have:
  // - API calls to fetch admin-specific data (e.g., all users, all listings).
  // - Components to display and manage this data (tables, forms for editing/deleting).
  // - Charts or summaries for an overview.
  // - More sophisticated routing for different admin sections.

  return (
    <div className="flex min-h-[calc(100vh-10rem)] bg-neutral-lightest animate-fadeIn"> {/* Adjust min-h based on navbar/footer */}
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="bg-white p-8 rounded-xl shadow-sleek-lg">
          <h1 className="text-3xl font-display font-bold text-secondary-dark mb-6">
            Admin Dashboard Overview
          </h1>
          <p className="text-neutral-dark mb-4">
            Welcome to the admin area. Here you can manage users, listings, and site settings.
          </p>
          
          {/* Example Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Total Users', value: '1,234', icon: <FiUsers className="text-primary" />, color: 'bg-primary-light' },
              { title: 'Active Listings', value: '567', icon: <FiList className="text-green-500" />, color: 'bg-green-100' },
              { title: 'Pending Approvals', value: '12', icon: <FiSettings className="text-yellow-500" />, color: 'bg-yellow-100' },
            ].map(stat => (
              <div key={stat.title} className={`p-6 rounded-xl shadow-md flex items-center space-x-4 ${stat.color}`}>
                <div className="p-3 rounded-full bg-white bg-opacity-50">
                  {React.cloneElement(stat.icon, { size: 28 })}
                </div>
                <div>
                  <p className="text-sm text-neutral-darkest font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-secondary-dark">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-secondary-dark mb-3">More Features Coming Soon!</h2>
            <p className="text-neutral-dark">
              This dashboard will soon allow detailed management of all site aspects.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;