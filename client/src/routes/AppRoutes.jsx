import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Jobs from "../pages/Jobs";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import SavedJobs from "../pages/SavedJobs";

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/jobs"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Jobs />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/saved-jobs"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <SavedJobs />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;