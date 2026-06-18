import { useState } from "react";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen">
            <Sidebar collapsed={collapsed} />

            <main className="flex-1 bg-gray-100 p-6">
                <button
                    onClick={() =>
                        setCollapsed(!collapsed)
                    }
                    className="mb-4 px-4 py-2 bg-black text-white rounded"
                >
                    ☰
                </button>

                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;