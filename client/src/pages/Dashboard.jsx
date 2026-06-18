import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [stats, setStats] = useState({
        totalJobs: 0,
        savedJobs: 0,
        applications: 0,
        matchScore: 78,
    });

    const [recentJobs, setRecentJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");

            const [jobsRes, savedRes, appRes] =
                await Promise.all([
                    axios.get(
                        "http://localhost:5000/api/jobs/aggregate?page=1"
                    ),

                    axios.get(
                        "http://localhost:5000/api/jobs/saved",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ),

                    axios.get(
                        "http://localhost:5000/api/applications",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ),
                ]);

            setStats({
                totalJobs: jobsRes.data.totalJobs || 0,
                savedJobs: savedRes.data.length || 0,
                applications: appRes.data.length || 0,
                matchScore: 78,
            });

            setRecentJobs(
                jobsRes.data.jobs?.slice(0, 5) || []
            );

            setApplications(
                appRes.data?.slice(0, 5) || []
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl mb-8">
                <h1 className="text-4xl font-bold">
                    CareerPilot 🚀
                </h1>

                <p className="mt-2">
                    Discover jobs, track applications,
                    and improve your resume match
                    score.
                </p>
            </div>

            {/* Welcome */}
            <h1 className="text-3xl font-bold">
                Welcome Back 👋
            </h1>

            <p className="text-gray-500 mt-2">
                Track jobs, applications and resume
                matches.
            </p>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mt-8">
                <StatCard
                    title="Total Jobs"
                    value={stats.totalJobs}
                />

                <StatCard
                    title="Saved Jobs"
                    value={stats.savedJobs}
                />

                <StatCard
                    title="Applications"
                    value={stats.applications}
                />

                <StatCard
                    title="Match Score"
                    value={`${stats.matchScore}%`}
                />
            </div>

            {/* Latest Jobs */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">
                    Latest Jobs
                </h2>

                {recentJobs.length > 0 ? (
                    recentJobs.map((job, index) => (
                        <div
                            key={
                                job._id ||
                                job.applyUrl ||
                                index
                            }
                            className="bg-white p-4 rounded shadow mb-3"
                        >
                            <h3 className="font-semibold">
                                {job.title}
                            </h3>

                            <p className="text-gray-600">
                                {job.company}
                            </p>

                            <p className="text-sm text-gray-500">
                                {job.location}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No jobs available.</p>
                )}
            </div>

            {/* Recent Applications */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">
                    Recent Applications
                </h2>

                {applications.length > 0 ? (
                    applications.map((app) => (
                        <div
                            key={app._id}
                            className="bg-white p-4 rounded shadow mb-3"
                        >
                            <p className="font-medium">
                                Status: {app.status}
                            </p>

                            {app.company && (
                                <p className="text-gray-600">
                                    {app.company}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No applications found.</p>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">
                {title}
            </h3>

            <p className="text-3xl font-bold mt-2">
                {value}
            </p>
        </div>
    );
}

export default Dashboard;