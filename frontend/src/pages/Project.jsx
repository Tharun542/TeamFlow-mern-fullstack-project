
import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import workspaceContext from "../context/AuthContext";
import { createProject, deleteProject } from "../services/project";

export function Projects() {
    const { projectCount, setProjectcount } = useContext(workspaceContext);
    const { id } = useParams();

    const token = localStorage.getItem("token");

    const [projectData, setProjectData] = useState({
        name: "",
        description: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setProjectData({
            ...projectData,
            [e.target.name]: e.target.value
        });
    };

    const handleProject = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const data = await createProject(id, projectData, token);

            setProjectcount(prev => [...prev, data]);

            setSuccess("Project created successfully!");

            setProjectData({
                name: "",
                description: ""
            });

        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to create project!"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (projectid) => {
        setError("");
        setSuccess("");

        try {
            const data = await deleteProject(id, projectid, token);

            setProjectcount(prev =>
                prev.filter(item => item._id !== projectid)
            );

            setSuccess(data.message || "Project deleted successfully!");

        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to delete project!"
            );
        }
    };

    const filteredProjects = projectCount.filter(item => {
        const workspaceId =
            typeof item.workspace === "object"
                ? item.workspace?._id
                : item.workspace;

        return workspaceId === id;
    });

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
                        className="block p-3 rounded-lg hover:bg-gray-800"
                    >
                        Workspaces
                    </Link>

                    <Link
                        to="/projects"
                        className="block bg-indigo-600 p-3 rounded-lg"
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
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Projects
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                Manage all your workspace projects here.
                            </p>
                        </div>
                        <div className="rounded-lg bg-white px-5 py-3 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Total Projects
                            </p>

                            <p className="text-2xl font-bold text-indigo-600">
                                {filteredProjects.length}
                            </p>
                        </div>

                    </div>
                    {success && (
                        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}
                    <div className="mb-10 rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-xl font-semibold text-gray-800">
                            Create New Project
                        </h2>
                        <form onSubmit={handleProject} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={projectData.name}
                                    onChange={handleChange}
                                    placeholder="Enter project name"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Project Description
                                </label>
                                <textarea
                                    name="description"
                                    value={projectData.description}
                                    onChange={handleChange}
                                    placeholder="Enter project description"
                                    required
                                    rows="3"
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating..." : "+ Create Project"}
                            </button>
                        </form>
                    </div>
                    <div>
                        <h2 className="mb-5 text-xl font-semibold text-gray-800">
                            Your Projects
                        </h2>
                        {filteredProjects.length === 0 ? (
                            <div className="rounded-xl bg-white px-6 py-12 text-center shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    No Projects Found
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Create your first project using the form above.
                                </p>
                            </div>

                        ) : (

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredProjects.map(item => (
                                    <div
                                        key={item._id}
                                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-600">
                                            {item.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {item.name}
                                        </h3>
                                        <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                                            {item.description}
                                        </p>
                                        <div className="mb-4 mt-5 flex items-center gap-3">
                                            <Link
                                                to={`/workspaces/${id}/project/${item._id}/edit`}
                                                className="flex-1 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-center text-sm font-semibold text-indigo-600 transition hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
                                            >
                                                Edit Project
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item._id)}
                                                className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
                                            >
                                                Delete Project
                                            </button>
                                        </div>
                                        <Link
                                            to={`/workspaces/${id}/project/${item._id}/tasks`}
                                            className="block w-full rounded-lg bg-gray-800 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gray-900"
                                        >
                                            View Tasks →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
