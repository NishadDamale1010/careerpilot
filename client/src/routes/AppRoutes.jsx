import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import SavedJobs from "../pages/SavedJobs";
import Applications from "../pages/Applications";
import Resume from "../pages/Resume";
import AIMatch from "../pages/AIMatch";
import AICoach from "../pages/AICoach";
import InterviewPrep from "../pages/InterviewPrep";
import Roadmaps from "../pages/Roadmaps";
import LearningHub from "../pages/LearningHub";
import Settings from "../pages/Settings";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

const protectedRoutes = [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/jobs", element: <Jobs /> },
    { path: "/jobs/:id", element: <JobDetails /> },
    { path: "/saved-jobs", element: <SavedJobs /> },
    { path: "/applications", element: <Applications /> },
    { path: "/resume", element: <Resume /> },
    { path: "/ai-match", element: <AIMatch /> },
    { path: "/ai-coach", element: <AICoach /> },
    { path: "/interview-prep", element: <InterviewPrep /> },
    { path: "/roadmaps", element: <Roadmaps /> },
    { path: "/learning", element: <LearningHub /> },
    { path: "/settings", element: <Settings /> },
];

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {protectedRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                {route.element}
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
            ))}

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;
