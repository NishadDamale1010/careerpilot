import { Link } from "react-router-dom";

function Sidebar({ collapsed }) {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div
            className={`bg-gray-900 text-white min-h-screen p-5 transition-all duration-300 ${collapsed ? "w-20" : "w-64"
                }`}
        >
            <h1 className="text-2xl font-bold mb-8">
                {collapsed ? "CP" : "CareerPilot"}
            </h1>

            <nav className="flex flex-col gap-4">
                <Link
                    to="/dashboard"
                    className="hover:text-blue-400"
                >
                    {collapsed ? "📊" : "📊 Dashboard"}
                </Link>

                <Link
                    to="/jobs"
                    className="hover:text-blue-400"
                >
                    {collapsed ? "💼" : "💼 Jobs"}
                </Link>

                <Link
                    to="/saved-jobs"
                    className="hover:text-blue-400"
                >
                    {collapsed ? "⭐" : "⭐ Saved Jobs"}
                </Link>

                <Link
                    to="/applications"
                    className="hover:text-blue-400"
                >
                    {collapsed ? "📝" : "📝 Applications"}
                </Link>

                <Link
                    to="/resume"
                    className="hover:text-blue-400"
                >
                    {collapsed ? "📄" : "📄 Resume"}
                </Link>

                <button
                    onClick={handleLogout}
                    className="mt-5 bg-red-500 p-2 rounded-lg hover:bg-red-600"
                >
                    {collapsed ? "🚪" : "Logout"}
                </button>
            </nav>
        </div>
    );
}

export default Sidebar;