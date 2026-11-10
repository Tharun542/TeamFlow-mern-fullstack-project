import { useContext, useEffect, useState } from "react";
import workspaceContext from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import {
    addMemberToWorkspace,
    deleteMemberFromWorkspace,
    updatememberrole
} from "../services/workspace";

export default function EditWorkspace() {
    const { workspace, setWorkspace } = useContext(workspaceContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const workspaceDetails = workspace.find(
        (item) => item._id === id
    );
    const [member, setMember] = useState({
        email: "",
        role: 'member'
    });

    const [data, setData] = useState({
        name: "",
        members: []
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loadingMember, setLoadingMember] = useState("");
    useEffect(() => {
        if (workspaceDetails) {
            setData({
                name: workspaceDetails.name || "",
                members: workspaceDetails.members || []
            });
        }
    }, [workspaceDetails]);
    const handleRoleChange = async (memberid, role) => {
        setError("");
        setSuccess("");
        setLoadingMember(memberid);
        try {
            const updateData = await updatememberrole(
                id,
                memberid,
                role,
                token
            );
            setData(prev => ({
                ...prev,
                members: prev.members.map(member =>
                    member.user === memberid
                        ? { ...member, role: role }
                        : member
                )
            }));
            setWorkspace(prev =>
                prev.map(item =>
                    item._id === id
                        ? {
                            ...item,
                            members: item.members.map(member =>
                                member.user === memberid
                                    ? { ...member, role: role }
                                    : member
                            )
                        }
                        : item
                )
            );
            setSuccess(
                updateData.message ||
                "Member role updated successfully!"
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update member role!"
            );
        } finally {
            setLoadingMember("");
        }
    };
    const handleDelete = async (memberid) => {
        setError("");
        setSuccess("");
        try {
            const result = await deleteMemberFromWorkspace(
                id,
                memberid,
                token
            );
            setData(prev => ({
                ...prev,
                members: prev.members.filter(
                    member => member.user !== memberid
                )
            }));
            setWorkspace(prev =>
                prev.map(item =>
                    item._id === id
                        ? {
                            ...item,
                            members: item.members.filter(
                                member => member.user !== memberid
                            )
                        }
                        : item
                )
            );
            setSuccess(
                result.message ||
                "Member deleted successfully!"
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete member!"
            );
        }
    };
    const handleReturn = () => {
        navigate("/workspaces");
    };

    const handleChange = (e) =>{
        setMember({
            ...member,
            [e.target.name] : e.target.value
        })
    }
   const handleAddMember = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const result = await addMemberToWorkspace(id, member, token);
            setWorkspace((prev) =>
                prev.map((item) =>
                    item._id === id
                        ? {
                            ...item,
                            members: result.data.members
                        }
                        : item
                )
            );
            setData((prev) => ({
                ...prev,
                members: result.data.members
            }));
            setSuccess(
                result.message || "Member added successfully!"
            );
            setMember({
                email: "",
                role: "member"
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to add member to workspace"
            );
        }
    };
    useEffect(() => {
        if(!success && !error){
            return
        };
        
        const timer = setTimeout(() => {
            setSuccess('');
            setError('');
        }, 3000);

        return () => clearTimeout(timer)
    }, [success, error]);
    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
                <button
                    onClick={handleReturn}
                    className="mb-5 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                >
                    Back to Workspace
                </button>
               <form
                    onSubmit={handleAddMember}
                    className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end"
                >
                    {/* Email */}
                    <div className="flex-1">
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={member.email}
                            onChange={handleChange}
                            placeholder="Enter member email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Role */}
                    <div className="flex-1">
                        <label
                            htmlFor="role"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Select Role
                        </label>

                        <select
                            name="role"
                            id="role"
                            value={member.role}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="member">Member</option>
                                <option value="admin">Admin</option>
                                <option value="viewer">Viewer</option>
                        </select>
                    </div>

                    {/* Add Member Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
                        >
                            Add Member
                        </button>
                    </div>
                </form>
                <h1 className="mb-6 text-2xl font-bold text-gray-800">
                    Edit Workspace
                </h1>
                {success && (
                    <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        {success}
                    </div>
                )}
                
                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}
                
                <div className="mb-8">
                    <label className="mb-2 block font-medium text-gray-700">
                        Workspace Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        disabled
                        className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
                    />
                </div>
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Workspace Members
                </h2>
                <div className="space-y-4">
                    {data.members.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No workspace members found.
                        </p>
                    ) : (
                        data.members.map(member => {
                            const user = member.user;
                            const userName =
                                typeof user === "object"
                                    ? user?.name || user?.email
                                    : user;

                            return (
                                <div
                                    key={member._id}
                                    className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center"
                                >
                                    <div>
                                        <h3 className="font-medium text-gray-800">
                                            {userName || "Workspace Member"}
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Member ID: {member._id}
                                        </p>
                                        
                                        <button
                                            onClick={() => handleDelete(member._id)}
                                            disabled={member.role === "owner"}
                                            className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Delete Member
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        
                                        <select
                                            value={member.role}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    member._id,
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                member.role === "owner" ||
                                                loadingMember === member._id
                                            }
                                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:opacity-60"
                                        >
                                            <option value="owner">Owner</option>
                                            <option value="admin">Admin</option>
                                            <option value="member">Member</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                        {loadingMember === member._id && (
                                            <span className="text-xs text-indigo-600">
                                                Updating...
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
