import { Link } from "react-router-dom";

function Sidebar() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };
    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
            <h1 className="text-2xl font-bold mb-8">
                CareerPilot
            </h1>

            <nav className="flex flex-col gap-4">
                <Link to="/dashboard">Dashboard</Link>

                <Link to="/jobs">Jobs</Link>

                <Link to="/saved-jobs">Saved Jobs</Link>

                <Link to="/applications">Applications</Link>

                <Link to="/resume">Resume</Link>
                <button
                    onClick={handleLogout}
                    className="mt-5 bg-red-500 p-2 rounded-lg "
                >
                    Logout
                </button>
            </nav>
        </div>
    );
}

export default Sidebar;