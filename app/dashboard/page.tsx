export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="mb-4">
        This is where you can view and manage your church activities.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="list-disc list-inside">
            <li>View upcoming events</li>
            <li>Check your attendance</li>
            <li>Submit connect absence</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
          <p>No recent activities to display.</p>
        </div>
        <div className="p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Announcements</h2>
          <p>Stay tuned for upcoming announcements.</p>
        </div>
      </div>
    </div>
  );
}
