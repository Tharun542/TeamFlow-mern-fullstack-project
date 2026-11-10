import React, { useState } from "react";
import { registerUser } from "../services/authService.js";
import { Link } from "react-router-dom";

const Register = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value
        });
    };

    const formSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const data = await registerUser(user);
            setSuccess(data.message || "Registration successfull");
            setUser({
                name: "",
                email: "",
                password: ""
            });

        } catch (err) {
            setError(err.response?.data?.message || "Registration Failed");
        }
        finally{
            setLoading(false)
        }
    };  

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                {error && (
                <p className="text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                )}
                {
                    success && (
                        <p className="text-green-600 bg-green-50 p-3 rounded-lg">{success}</p>
                    )
                }
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Join TeamFlow and manage your projects efficiently.
                    </p>
                </div>
                <form onSubmit={formSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={user.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={user.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                    >
                        Create Account
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?
                    <Link
                        to="/"
                        className="text-indigo-600 font-semibold hover:text-indigo-800 ml-1"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;