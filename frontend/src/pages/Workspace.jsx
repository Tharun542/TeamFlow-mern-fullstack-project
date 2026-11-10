
import { useContext, useState } from "react";
import {
    createWorkspace,
    deleteWorkspace
} from "../services/workspace";
import workspaceContext from "../context/AuthContext";
import { Link } from "react-router-dom";
export default function Workspace() {
    const { workspace, setWorkspace } = useContext(workspaceContext);
    const token = localStorage.getItem("token");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        role: "member"
    });

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };
    const handleWorkspace = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        setLoading(true);
        try {
            const result = await createWorkspace(
                { name: data.name, role: data.role },
                token
            );
            setWorkspace((prev) => [...prev, result.data]);
            setSuccess(
                result.message || "Workspace created successfully!"
            );
            setData({
                name: "",
                role: "member"
            });
        } catch (err) {
            setError(
                err?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setError("");
        setSuccess("");
        try {
            const result = await deleteWorkspace(id, token);
            setWorkspace(prev =>
                prev.filter(item => item._id !== id)
            );
            setSuccess(
                result.message || "Workspace deleted successfully"
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete workspace"
            );
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 flex">
        
            <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block shrink-0">
                <h1 className="text-2xl font-bold mb-10">
                    TeamFlow
                </h1>
                <nav className="space-y-3">
                    <Link
                        to="/dashboard"
                        className="block p-3 rounded-lg hover:bg-gray-800"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/workspaces"
                        className="block bg-indigo-600 p-3 rounded-lg"
                    >
                        Workspaces
                    </Link>
                    <Link
                        to="/projects"
                        className="block p-3 rounded-lg hover:bg-gray-800"
                    >
                        Projects
                    </Link>
                    <Link
                        to="/my-tasks"
                        className="block p-3 rounded-lg hover:bg-gray-800"
                    >
                        My Tasks
                    </Link>
                </nav>
            </aside>
           
            <main className="flex-1 min-w-0 px-4 py-10 sm:px-8">
                <div className="max-w-6xl mx-auto">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Workspaces
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Manage your teams and collaborate in one place.
                            </p>
                        </div>
                        <div className="bg-indigo-100 text-indigo-700 px-5 py-3 rounded-xl">
                            <span className="text-sm font-medium">
                                Total Workspaces
                            </span>

                            <h2 className="text-2xl font-bold">
                                {workspace.length}
                            </h2>
                        </div>
                    </div>
                    {success && (
                        <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-10">

                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            Create New Workspace
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Create a workspace to organize your projects and team members.
                        </p>
                        <form
                            onSubmit={handleWorkspace}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <div className="flex-1">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Workspace Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter workspace name"
                                    onChange={handleChange}
                                    value={data.name}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="role"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Additional Member Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={handleChange}
                                    className="w-100 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="member">Member</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    You will automatically be the workspace owner.
                                </p>
                            </div>
                            <div className="sm:pt-[26px]">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
                                >
                                    {loading
                                        ? "Creating..."
                                        : "+ Create Workspace"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Your Workspaces
                            </h2>
                            <span className="text-sm text-gray-500">
                                {workspace.length} available
                            </span>
                        </div>
                        {workspace.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {workspace.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 transition duration-300"
                                    >
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-600 text-sm font-medium hover:text-red-800 mb-4"
                                        >
                                            Delete Workspace
                                        </button>
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold">
                                                {item.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <Link
                                                to={`/workspace/${item._id}/`}
                                                className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                                            >
                                                Edit Workspace →
                                            </Link>
                                            <span>
                                                {item.members?.map(member => member.role).join(", ") || "No Members"}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-5">
                                            Manage your projects, tasks and team members.
                                        </p>
                                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                            <span className="text-xs text-gray-400">
                                                Workspace ID: {item._id?.slice(-6)}
                                            </span>
                                            <Link
                                                to={`/workspace/${item._id}/projects`}
                                                className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                                            >
                                                View Workspace →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                                <div className="text-5xl mb-4">
                                    📁
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    No Workspaces Yet
                                </h3>
                                <p className="text-gray-500 mt-2">
                                    Create your first workspace to get started.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
