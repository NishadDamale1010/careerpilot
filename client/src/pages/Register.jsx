import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroDashboard from "../assets/landing-dashboard.png";
import { getErrorMessage } from "../services/api";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            await registerUser(formData);
            toast.success("Registration successful. Redirecting...");
            window.setTimeout(() => {
                navigate("/login", { replace: true });
            }, 600);
        } catch (requestError) {
            toast.error(getErrorMessage(requestError, "Registration failed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-slate-950 bg-cover bg-center px-4 py-10"
            style={{
                backgroundImage: `linear-gradient(90deg, rgba(248, 250, 252, 0.96), rgba(248, 250, 252, 0.9)), url(${heroDashboard})`,
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-[var(--border)] glass-card p-8 shadow-lg"
            >
                <Link
                    to="/"
                    className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
                >
                    CareerPilot
                </Link>

                <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text-primary)]">
                    Create Account
                </h1>

                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Set up your CareerPilot workspace.
                </p>

                <label className="mt-6 block text-sm font-semibold text-[var(--text-primary)]">
                    Name
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="mt-4 block text-sm font-medium text-slate-700">
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="mt-4 block text-sm font-medium text-slate-700">
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        minLength={6}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        onChange={handleChange}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-md bg-slate-950 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Creating..." : "Register"}
                </button>

                <p className="mt-5 text-center text-sm text-slate-600">
                    Already have an account?
                    <Link
                        to="/login"
                        className="ml-2 font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Register;

