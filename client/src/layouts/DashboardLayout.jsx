import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
    return (
        <div className="flex">
            <Sidebar />

            <main className="flex-1 p-8 bg-gray-100 min-h-screen">
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;