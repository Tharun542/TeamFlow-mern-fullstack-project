
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import workspaceContext from "../context/AuthContext";
function Dashboard() {
    const {workspace, setWorkspace, projectCount, setProjectcount, taskCollect, setTaskCollect } = useContext(workspaceContext);

    const navigate = useNavigate();
    const [taskCount, setTaskCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [viewalltasks, setViewalltasks] = useState(false);
    const [viewallprojects, setViewallprojects] = useState(false);
    const [error, setError] = useState('');

    const completedTask = taskCollect.filter((item)=> 
    item.status === 'completed');

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {loading && <p>Loading workspaces...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
                <h1 className="text-2xl font-bold mb-10">
                    TeamFlow
                </h1>
                <nav className="space-y-3">
                    <Link to="/dashboard"
                        className="block bg-indigo-600 p-3 rounded-lg">
                        Dashboard
                    </Link>
                    <Link to="/workspaces"
                        className="block p-3 rounded-lg hover:bg-gray-800">
                        Workspaces
                    </Link>
                    <Link to="/projects"
                        className="block p-3 rounded-lg hover:bg-gray-800">
                        Projects
                    </Link>
                    <Link to="/my-tasks"
                        className="block p-3 rounded-lg hover:bg-gray-800">
                        My Tasks
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-6 md:p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            Dashboard
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Welcome back! Here's your TeamFlow overview.
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                    >
                        Logout
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-gray-500">Workspaces</p>
                        <h3 className="text-3xl font-bold mt-2">{workspace.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-gray-500">Projects</p>
                        <h3 className="text-3xl font-bold mt-2">{projectCount.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-gray-500">My Tasks</p>
                        <h3 className="text-3xl font-bold mt-2">{taskCollect.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-gray-500">Completed Tasks</p>
                        <h3 className="text-3xl font-bold mt-2">
                            {completedTask.length}
                        </h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-800">
                                Recent Projects
                            </h3>
                            <button
                                onClick={() => setViewallprojects(!viewallprojects)}
                                className="text-indigo-600 text-sm font-semibold"
                            >
                                {viewallprojects ? "viewless" : "viewall"}
                            </button>
                        </div>
                        {projectCount.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(viewallprojects
                                    ? projectCount
                                    : projectCount.slice(0, 3)
                                ).map((item) => (
                                    <div
                                        key={item._id}
                                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-300 transition"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="bg-indigo-100 p-3 rounded-lg">
                                                <span className="text-2xl">📁</span>
                                            </div>
                                            <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                                Project
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {item.description}
                                        </p>
                                        <Link
                                            to={`/workspaces/${typeof item.workspace === "object" ? item.workspace?._id : item.workspace}/project/${item._id}/tasks`}
                                            className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition"
                                        >
                                            View Tasks
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="text-4xl mb-3">📂</div>
                                <h4 className="text-gray-700 font-semibold">
                                    No Projects Yet
                                </h4>
                                <p className="text-gray-500 text-sm mt-2">
                                    Create a project to get started.
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-800">
                                My Tasks
                            </h3>
                            <button
                                onClick={() => setViewalltasks(!viewalltasks)}
                                className="text-indigo-600 text-sm font-semibold"
                            >
                                {viewalltasks ? "viewless" : "viewall"}
                            </button>
                        </div>
                        {taskCollect.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(viewalltasks
                                    ? taskCollect
                                    : taskCollect.slice(0, 3)
                                ).map((item) => (
                                    <div
                                        key={item._id}
                                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-300 transition"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="bg-blue-100 p-3 rounded-lg">
                                                <span className="text-2xl">📋</span>
                                            </div>
                                            <span
                                                className={`text-xs font-medium px-3 py-1 rounded-full ${
                                                    item.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : item.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : item.status === "in-progress"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-indigo-100 text-indigo-700"
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {item.description}
                                        </p>
                                        <div className="border-t border-gray-100 pt-3">
                                            <p className="text-xs text-gray-500 mb-3">
                                                Priority: {item.priority || "Not specified"}
                                            </p>
                                            <Link
                                                to="/my-tasks"
                                                className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition"
                                            >
                                                View Task
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="text-4xl mb-3">📝</div>
                                <h4 className="text-gray-700 font-semibold">
                                    No Tasks Yet
                                </h4>
                                <p className="text-gray-500 text-sm mt-2">
                                    Create a task to get started.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
