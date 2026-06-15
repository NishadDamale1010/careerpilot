import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
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
            await registerUser(formData);

            alert("Registration Successful");

            navigate("/login");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="w-96 p-6 shadow-lg rounded-lg"
            >
                <h2 className="text-2xl font-bold mb-4">
                    Register
                </h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                />

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
                    Register
                </button>

                <p className="mt-4">
                    Already have an account?
                    <Link
                        to="/login"
                        className="text-blue-500 ml-2"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Register;