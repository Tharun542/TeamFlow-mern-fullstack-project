
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
                <h1 className="text-2xl font-bold mb-10">
                    TeamFlow
                </h1>
                <nav className="space-y-3">
                    <a href="/dashboard"
                        className="block bg-indigo-600 p-3 rounded-lg">
                        Dashboard
                    </a>
                    <a href="/workspaces"
                        className="block p-3 rounded-lg hover:bg-gray-800">
                        Workspaces
                    </a>
                    <a href="/projects"
                        className="block p-3 rounded-lg hover:bg-gray-800">
                        Projects
                    </a>
                    <a href="/my-tasks"
                        className="block p-3 rounded-lg hover:bg-gray-800">
                        My Tasks
                    </a>
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
                        <h3 className="text-3xl font-bold mt-2">0</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-gray-500">Projects</p>
                        <h3 className="text-3xl font-bold mt-2">0</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-gray-500">My Tasks</p>
                        <h3 className="text-3xl font-bold mt-2">0</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-gray-500">Completed Tasks</p>
                        <h3 className="text-3xl font-bold mt-2">0</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-800">
                                Recent Projects
                            </h3>

                            <button className="text-indigo-600 text-sm font-semibold">
                                View All
                            </button>
                        </div>
                        <div className="text-center py-10">
                            <h4 className="text-gray-700 font-semibold">
                                No projects yet
                            </h4>
                            <p className="text-gray-500 text-sm mt-2">
                                Create a project to get started.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-800">
                                My Tasks
                            </h3>
                            <button className="text-indigo-600 text-sm font-semibold">
                                View All
                            </button>
                        </div>
                        <div className="text-center py-10">
                            <h4 className="text-gray-700 font-semibold">
                                No tasks assigned
                            </h4>
                            <p className="text-gray-500 text-sm mt-2">
                                Your assigned tasks will appear here.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
