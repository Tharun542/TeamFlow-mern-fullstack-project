
import { useParams, useNavigate } from "react-router-dom";
import { updateProject } from "../services/project";
import { useContext, useEffect, useState } from "react";
import workspaceContext from "../context/AuthContext";

export default function EditProject() {
    const { projectCount, setProjectcount } = useContext(workspaceContext);
    const token = localStorage.getItem("token");
    const { id, projectid } = useParams();
    const navigate = useNavigate();
    const project = projectCount.find(
        (item) => item._id === projectid
    );
    const [editData, setEditdata] = useState({
        name: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    useEffect(() => {
        if (project) {
            setEditdata({
                name: project.name,
                description: project.description
            });
        }
    }, [project]);
    const handleChange = (e) => {
        setEditdata({
            ...editData,
            [e.target.name]: e.target.value
        });
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const data = await updateProject(
                id,
                projectid,
                editData,
                token
            );

            setProjectcount((prev) =>
                prev.map((item) =>
                    item._id === projectid
                        ? { ...item, ...editData }
                        : item
                )
            );
            setSuccess(data.message || "Project updated successfully!");
        }
        catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update project"
            );
        }
        finally {
            setLoading(false);
        }
    };

    if (!project) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                    <h2 className="text-xl font-semibold text-white">
                        Project not found
                    </h2>
                    <p className="text-slate-400 mt-2">
                        The project may not be loaded yet.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    
return (
<div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto">
        <div className="mb-8">
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 hover:text-indigo-600 mb-5 flex items-center gap-2 transition"
            >
                ← Back to Projects
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
                Edit Project
            </h1>
            <p className="text-gray-500 mt-2">
                Update your project name and description.
            </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                        placeholder="Enter project name"
                        required
                        minLength={2}
                        maxLength={10}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        Enter a project name between 2 and 10 characters.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Description
                    </label>
                    <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleChange}
                        placeholder="Describe your project"
                        required
                        minLength={2}
                        maxLength={50}
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 outline-none resize-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        Maximum 50 characters.
                    </p>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        {success}
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-sm"
                    >
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
);
}
