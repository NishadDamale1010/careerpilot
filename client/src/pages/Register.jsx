import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../services/api";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";
import heroDashboard from "../assets/landing-dashboard.png";

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
            className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10 transition-colors"
            style={{
                backgroundImage: `linear-gradient(90deg, rgba(248, 250, 252, 0.92), rgba(248, 250, 252, 0.85)), url(${heroDashboard})`,
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-[var(--border)] glass-card p-8 shadow-xl"
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

                <label className="mt-6 block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Name
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        className="input mt-1.5"
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="mt-4 block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="input mt-1.5"
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="mt-4 block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        minLength={6}
                        className="input mt-1.5"
                        onChange={handleChange}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn w-full mt-6 py-3 bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 border-none"
                >
                    {loading ? "Creating..." : "Register"}
                </button>

                <p className="mt-5 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                    Already have an account?
                    <Link
                        to="/login"
                        className="ml-2 font-semibold"
                        style={{ color: "var(--primary)" }}
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Register;

