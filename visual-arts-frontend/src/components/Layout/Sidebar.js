import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Manage Users", path: "/admin/manage-users" },
    { name: "Manage Artworks", path: "/admin/manage-artworks" },
    { name: "Manage Events", path: "/admin/manage-events" },
    { name: "Analytics", path: "/admin/analytics" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full bg-gray-900 text-white w-64">
      <h2 className="text-xl font-bold p-4">Admin Panel</h2>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${
                  isActive ? "bg-orange-500 text-white" : "text-gray-300"
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
