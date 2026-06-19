import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import heroDashboard from "../assets/landing-dashboard.png";
import { getErrorMessage } from "../services/api";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || "/dashboard";

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await loginUser(formData);
            localStorage.setItem("token", data.token);
            toast.success("Welcome back!");
            navigate(redirectTo, { replace: true });
        } catch (err) {
            toast.error(getErrorMessage(err, "Login failed. Check your credentials."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-slate-950 bg-cover bg-center px-4 py-10"
            style={{
                backgroundImage: `linear-gradient(90deg, rgba(248,250,252,0.96), rgba(248,250,252,0.9)), url(${heroDashboard})`,
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-[var(--border)] glass-card p-8 shadow-lg"
            >
                <Link to="/" className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]">
                    CareerPilot
                </Link>

                <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text-primary)]">Welcome back</h1>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Sign in to continue tracking jobs and applications.
                </p>

                <label className="mt-6 block text-sm font-semibold text-[var(--text-primary)]">
                    Email
                    <input
                        id="login-email"
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
                        id="login-password"
                        type="password"
                        name="password"
                        value={formData.password}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        onChange={handleChange}
                        required
                    />
                </label>

                <button
                    id="login-submit"
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-md bg-slate-950 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="mt-5 text-center text-sm text-slate-600">
                    Don't have an account?
                    <Link to="/register" className="ml-2 font-semibold text-blue-600 hover:text-blue-700">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
