import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Sales',
      value: '$12,345',
      change: '+12%',
      changeType: 'positive',
      icon: '💰'
    },
    {
      title: 'Orders',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: '🛒'
    },
    {
      title: 'Products',
      value: '89',
      change: '+3%',
      changeType: 'positive',
      icon: '📦'
    },
    {
      title: 'Customers',
      value: '1,234',
      change: '+15%',
      changeType: 'positive',
      icon: '👥'
    }
  ];

  const recentOrders = [
    { id: '#1234', customer: 'John Doe', amount: '$299.99', status: 'Completed' },
    { id: '#1235', customer: 'Jane Smith', amount: '$199.99', status: 'Processing' },
    { id: '#1236', customer: 'Mike Johnson', amount: '$399.99', status: 'Shipped' },
    { id: '#1237', customer: 'Sarah Wilson', amount: '$149.99', status: 'Pending' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-base-content/70">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-figure text-primary text-3xl">
              {stat.icon}
            </div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value text-primary">{stat.value}</div>
            <div className={`stat-desc ${stat.changeType === 'positive' ? 'text-success' : 'text-error'}`}>
              ↗︎ {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span className={`badge ${
                          order.status === 'Completed' ? 'badge-success' :
                          order.status === 'Processing' ? 'badge-warning' :
                          order.status === 'Shipped' ? 'badge-info' :
                          'badge-neutral'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="space-y-3">
              <button className="btn btn-primary w-full">Add New Product</button>
              <button className="btn btn-secondary w-full">View Orders</button>
              <button className="btn btn-accent w-full">Manage Inventory</button>
              <button className="btn btn-outline w-full">View Analytics</button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Sales Overview</h2>
            <div className="h-64 bg-base-100 rounded flex items-center justify-center">
              <p className="text-center opacity-70">Chart placeholder</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Top Products</h2>
            <div className="h-64 bg-base-100 rounded flex items-center justify-center">
              <p className="text-center opacity-70">Chart placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
