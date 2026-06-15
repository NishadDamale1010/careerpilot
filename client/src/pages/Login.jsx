import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await loginUser(formData);

            localStorage.setItem(
                "token",
                data.token
            );

            navigate("/dashboard");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
            console.log(`error during login ${error}`);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="w-96 p-6 shadow-lg rounded-lg"
            >
                <h2 className="text-2xl font-bold mb-4">
                    Login
                </h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                />

                <button
                    className="w-full bg-black text-white p-2"
                >
                    Login
                </button>

                <p className="mt-4">
                    Don't have an account?
                    <Link
                        to="/register"
                        className="text-blue-500 ml-2"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;