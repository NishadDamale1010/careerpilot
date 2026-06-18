import { useEffect, useState } from "react";
import axios from "axios";
import ApplicationCard from "../components/ApplicationCard";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.get(
                "http://localhost:5000/api/applications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setApplications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">
                    Applications
                </h1>

                <p>Loading applications...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">
                Applications
            </h1>

            <p className="text-gray-500 mb-6">
                Track all your job applications in one place.
            </p>

            <div className="mb-6">
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-semibold">
                        Total Applications
                    </h2>

                    <p className="text-3xl font-bold mt-2">
                        {applications.length}
                    </p>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center shadow">
                    <h2 className="text-xl font-semibold">
                        No Applications Yet
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Start applying for jobs to track
                        them here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <ApplicationCard
                            key={app._id}
                            application={app}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Applications;