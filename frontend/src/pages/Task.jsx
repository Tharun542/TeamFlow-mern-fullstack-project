import { useContext, useEffect, useState } from "react";
import workspaceContext from "../context/AuthContext";
import { createTask, deleteTask } from "../services/task";
import { Link, useParams } from "react-router-dom";

export function Tasks() {
    const { id, projectid } = useParams();

    const {
        workspace,
        taskCollect,
        setTaskCollect
    } = useContext(workspaceContext);

    const token = localStorage.getItem("token");

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [deletingTask, setDeletingTask] = useState("");

    const [task, setTask] = useState({
        title: "",
        description: "",
        assignee: "",
        status: "todo",
        priority: "medium"
    });

    const currentWorkspace = workspace.find(
        item => item._id === id
    );

    const members = currentWorkspace?.members || [];

    const filteredTasks = taskCollect.filter(item => {
        const taskProjectId =
            typeof item.project === "object"
                ? item.project?._id
                : item.project;

        return String(taskProjectId) === String(projectid);
    });

    const handleChange = (e) => {
        setTask(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleTask = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!task.assignee) {
            setError("Please select a workspace member.");
            return;
        }
        setLoading(true);
        try {
            const data = await createTask(
                id,
                projectid,
                task,
                token
            );
            const createdTask = data.details;
            if (!createdTask) {
                throw new Error(
                    "Created task was not returned by the server."
                );
            }

            setTaskCollect(prev => [...prev, createdTask]);

            setSuccess(
                data.message || "Task created successfully!"
            );

            setTask({
                title: "",
                description: "",
                assignee: "",
                status: "todo",
                priority: "medium"
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to create task!"
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() =>{
        if(!success && !error){
            return
        }

        const timer = setTimeout(() => {
            setSuccess('');
            setError('')
        }, 3000);

        return () => clearTimeout(timer);
    }, [success, error])
    const handleDelete = async (taskid) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );
        if (!confirmDelete) return;
        setError("");
        setSuccess("");
        setDeletingTask(taskid);
        try {
            const data = await deleteTask(
                id,
                taskid,
                token
            );
            setTaskCollect(prev =>
                prev.filter(item => item._id !== taskid)
            );
            setSuccess(
                data.message || "Task deleted successfully!"
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete task!"
            );
        } finally {
            setDeletingTask("");
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
                        className="block p-3 rounded-lg hover:bg-gray-800"
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
                        className="block bg-indigo-600 p-3 rounded-lg"
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
                                Tasks
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                Manage and track your project tasks.
                            </p>
                        </div>
                        <div className="rounded-lg bg-white px-5 py-3 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Total Tasks
                            </p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {filteredTasks.length}
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
                            Create New Task
                        </h2>
                        <form
                            onSubmit={handleTask}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Task Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={task.title}
                                    onChange={handleChange}
                                    placeholder="Enter task title"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Task Description
                                </label>
                                <textarea
                                    name="description"
                                    value={task.description}
                                    onChange={handleChange}
                                    placeholder="Enter task description"
                                    rows="3"
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Assign To
                                </label>
                                <select
                                    name="assignee"
                                    value={task.assignee}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">
                                        Select a workspace member
                                    </option>
                                    {members.map(member => {
                                        const user = member.user;
                                        const userId =
                                            typeof user === "object"
                                                ? user?._id
                                                : user;
                                        const userName =
                                            typeof user === "object"
                                                ? user?.name || user?.email || userId
                                                : userId;

                                        return (
                                            <option
                                                key={userId}
                                                value={userId}
                                            >
                                                {userName}
                                            </option>
                                        );
                                    })}
                                </select>
                                {members.length === 0 && (
                                    <p className="mt-2 text-xs text-amber-600">
                                        No workspace members found. Make sure the workspace members are loaded.
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={task.status}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="active">
                                            Todo
                                        </option>
                                        <option value="pending">
                                            In Progress
                                        </option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={task.priority}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Creating..."
                                    : "+ Create Task"}
                            </button>
                        </form>
                    </div>
                    <h2 className="mb-5 text-xl font-semibold text-gray-800">
                        Your Tasks
                    </h2>
                    {filteredTasks.length === 0 ? (
                        <div className="rounded-xl bg-white px-6 py-12 text-center shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-700">
                                No Tasks Found
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Create your first task using the form above.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTasks.map(item => (
                                <div
                                    key={item._id}
                                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-600">
                                            {item.title?.charAt(0).toUpperCase()}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item._id)}
                                            disabled={deletingTask === item._id}
                                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {deletingTask === item._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                                        {item.description || "No description provided."}
                                    </p>
                                    <div className="mt-4">
                                        <span className="text-sm font-medium text-gray-500">
                                            Status:
                                        </span>
                                        <span
                                            className={`ml-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                item.status === "completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : item.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-indigo-100 text-indigo-700"
                                            }`}
                                        >
                                            {item.status
                                                ? item.status.charAt(0).toUpperCase() +
                                                  item.status.slice(1)
                                                : "Active"}
                                        </span>
                                    </div>
                                    {item.priority && (
                                        <div className="mt-3">
                                            <span className="text-sm font-medium text-gray-500">
                                                Priority:
                                            </span>
                                            <span className="ml-2 text-sm font-semibold capitalize text-gray-700">
                                                {item.priority}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}