import { useState } from "react";
import { loginUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("")
    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value
        });
    };
    const handleForm = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setSuccess("");
        try {
            const data = await loginUser(user);
            setSuccess(data.message || "Login successfull");
            if (!data) {
                setError("Data not received");
                return;
            }
            if (!data.token) {
                setError("Login token not received");
                return;
            }
            
            localStorage.setItem("token", data.token);
            setTimeout(()=>{
                navigate("/dashboard");
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
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
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 mt-3 text-sm">
                        Login to your TeamFlow account.
                    </p>
                </div>
                <form onSubmit={handleForm} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={user.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?
                    <Link
                        to="/register"
                        className="text-indigo-600 font-semibold hover:text-indigo-800 ml-1"
                    >
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;