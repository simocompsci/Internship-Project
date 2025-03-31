import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, AlertCircle, RefreshCw, ChevronLeft, ChevronRight ,Trash2 , Edit } from "lucide-react";
import { userService } from "../../services/api";
import { handleApiError, fallbackData } from "../../utils/apiUtils";
import Modal from "../common/Modal";

const UsersTable = () => {
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [apiAvailable, setApiAvailable] = useState(true);
	
	// Pagination states
	const [currentPage, setCurrentPage] = useState(1);
	const [usersPerPage] = useState(10);

	// Modal states
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "customer",
		status: "active",
	});

	// Fetch users on component mount
	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		setLoading(true);
		setError(null); // Clear any previous errors
		try {
			console.log("Fetching users from API...");
			const response = await userService.getAll();
			
			// Access the nested `users` array inside `response.data`
			const userData = Array.isArray(response.data.users) ? response.data.users : [];
			
			if (userData.length === 0) {
				setError("No users found."); // Handle empty data
			} else {
				setUsers(userData); // Update users state
				setFilteredUsers(userData); // Update filteredUsers state
				setApiAvailable(true); // Mark API as available
			}
		} catch (err) {
			console.error("Error fetching users:", err);
			setError(handleApiError(err)); // Set error message
			setApiAvailable(false); // Mark API as unavailable
	
			// Fallback to mock data if API fails
			const fallbackUserData = Array.isArray(fallbackData.users) ? fallbackData.users : [];
			setUsers(fallbackUserData);
			setFilteredUsers(fallbackUserData);
		} finally {
			setLoading(false); // Ensure loading is set to false
		}
	};

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = users.filter(
			(user) =>
				user.name.toLowerCase().includes(term) ||
				user.email.toLowerCase().includes(term) ||
				user.role.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	// Form handling
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Create user
	const openCreateModal = () => {
		if (!apiAvailable) {
			alert("Cannot create users while API is unavailable. Please check your backend connection.");
			return;
		}
		setFormData({
			name: "",
			email: "",
			role: "customer",
			status: "active",
		});
		setIsCreateModalOpen(true);
	};

	const handleCreateUser = async (e) => {
		e.preventDefault();
		try {
			const response = await userService.create(formData);
			setUsers([...users, response.data]);
			setFilteredUsers([...filteredUsers, response.data]);
			setIsCreateModalOpen(false);
			// Reset form
			setFormData({
				name: "",
				email: "",
				role: "customer",
				status: "active",
			});
		} catch (err) {
			console.error("Error creating user:", err);
			alert("Failed to create user: " + handleApiError(err));
		}
	};

	// Edit user
	const openEditModal = (user) => {
		if (!apiAvailable) {
			alert("Cannot edit users while API is unavailable. Please check your backend connection.");
			return;
		}
		setCurrentUser(user);
		setFormData({
			name: user.name,
			email: user.email,
			role: user.role,
			status: user.status,
		});
		setIsEditModalOpen(true);
	};

	const handleUpdateUser = async (e) => {
		e.preventDefault();
		try {
			// If password is empty, remove it from the request
			const dataToSend = { ...formData };
			if (!dataToSend.password) delete dataToSend.password;

			const response = await userService.update(currentUser.id, dataToSend);

			// Update local state
			const updatedUsers = users.map((user) =>
				user.id === currentUser.id ? { ...user, ...response.data } : user
			);
			setUsers(updatedUsers);
			setFilteredUsers(
				updatedUsers.filter(
					(user) =>
						user.name.toLowerCase().includes(searchTerm) ||
						user.email.toLowerCase().includes(searchTerm) ||
						user.role.toLowerCase().includes(searchTerm)
				)
			);
			setIsEditModalOpen(false);
		} catch (err) {
			console.error("Error updating user:", err);
			alert("Failed to update user: " + handleApiError(err));
		}
	};

	// Delete user
	const openDeleteModal = (user) => {
		if (!apiAvailable) {
			alert("Cannot delete users while API is unavailable. Please check your backend connection.");
			return;
		}
		setCurrentUser(user);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteUser = async () => {
		try {
			await userService.delete(currentUser.id);

			// Update local state
			const updatedUsers = users.filter((user) => user.id !== currentUser.id);
			setUsers(updatedUsers);
			setFilteredUsers(
				updatedUsers.filter(
					(user) =>
						user.name.toLowerCase().includes(searchTerm) ||
						user.email.toLowerCase().includes(searchTerm) ||
						user.role.toLowerCase().includes(searchTerm)
				)
			);
			setIsDeleteModalOpen(false);
		} catch (err) {
			console.error("Error deleting user:", err);
			alert("Failed to delete user: " + handleApiError(err));
		}
	};

	// Get current users for pagination
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

	// Change page
	const paginate = (pageNumber) => setCurrentPage(pageNumber);
	const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
	const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

	return (
		<>
			<motion.div
				className="bg-gray-300 shadow-lg rounded-xl p-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-900">Users</h2>
					<div className="flex space-x-4">
						<div className="relative">
							<input
								type="text"
								placeholder="Search users..."
								className="bg-gray-400 bg-opacity-15 text-black  placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
								value={searchTerm}
								onChange={handleSearch}
							/>
							<Search className="absolute left-3 top-2.5 text-gray-600" size={18} />
						</div>
						<button
							onClick={openCreateModal}
							className={`${apiAvailable ? "bg-[#118ac1] hover:bg-[#118ac1]/50" : "bg-gray-600 cursor-not-allowed"} text-white px-4 py-2 rounded-lg flex items-center`}
						>
							<Plus size={18} className="mr-1" /> Add User
						</button>
					</div>
				</div>

				{error && (
					<div className="bg-red-900 bg-opacity-50 text-red-200 p-3 rounded-md mb-4 flex items-center justify-between">
						<div className="flex items-center">
							<AlertCircle size={18} className="mr-2" />
							{error}
						</div>
						<button
							onClick={fetchUsers}
							className="flex items-center text-red-200 hover:text-white bg-red-800 hover:bg-red-700 px-2 py-1 rounded text-sm"
						>
							<RefreshCw size={14} className="mr-1" /> Retry
						</button>
					</div>
				)}

				{!apiAvailable && !error && (
					<div className="bg-yellow-900 bg-opacity-50 text-yellow-200 p-3 rounded-md mb-4 flex items-center justify-between">
						<div className="flex items-center">
							<AlertCircle size={18} className="mr-2" />
							Using mock data. API server is not available.
						</div>
						<button
							onClick={fetchUsers}
							className="flex items-center text-yellow-200 hover:text-white bg-yellow-800 hover:bg-yellow-700 px-2 py-1 rounded text-sm"
						>
							<RefreshCw size={14} className="mr-1" /> Check Connection
						</button>
					</div>
				)}

				<div className="overflow-x-auto">
					{loading ? (
						<div className="text-center py-4">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
							<p className="mt-2 text-gray-400">Loading users...</p>
						</div>
					) : (
						<>
							<table className="min-w-full border-separate border-spacing-y-1 border-spacing-x-0">
								<thead>
									<tr className="bg-gray-900">
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider rounded-s-lg'>
											Name
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
											Email
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
											Role
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
											Status
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider rounded-e-lg'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-700'>
									{filteredUsers.length === 0 ? (
										<tr>
											<td colSpan="5" className="px-6 py-4 text-center text-gray-900">
												No users found matching your search.
											</td>
										</tr>
									) : (
										currentUsers.map((user, index) => (
											<motion.tr
												key={user.id}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.3 }}
												className={`${index % 2 === 0 ? 'bg-gray-400 bg-opacity-10' : 'bg-gray-100'} overflow-hidden rounded-xl`}
											>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-l-xl">
													{user.name}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
													{user.email}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
													{user.role}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
													{user.status}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-r-xl'>
													<button
														className='text-blue-900 hover:text-blue-500 mr-2'
														onClick={() => openEditModal(user)}
													>
														<Edit size={20} />
													</button>
													<button
														className='text-red-700 hover:text-red-500'
														onClick={() => openDeleteModal(user)}
													>
														<Trash2 size={20} />
													</button>
												</td>
											</motion.tr>
										))
									)}
								</tbody>
							</table>
							
							{/* Pagination Controls */}
							{filteredUsers.length > 0 && (
								<div className="flex items-center justify-between mt-4 px-2">
									<div className="text-md text-gray-900">
										Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
									</div>
									<div className="flex space-x-2">
										<button
											onClick={prevPage}
											disabled={currentPage === 1}
											className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-900 cursor-not-allowed' : 'text-gray-50 hover:bg-gray-900'}`}
										>
											<ChevronLeft size={18} />
										</button>
										
										{/* Page numbers */}
										<div className="flex space-x-1">
											{[...Array(totalPages).keys()].map(number => (
												<button
													key={number + 1}
													onClick={() => paginate(number + 1)}
													className={`px-3 py-1 rounded-md ${currentPage === number + 1 ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
												>
													{number + 1}
												</button>
											))}
										</div>
										
										<button
											onClick={nextPage}
											disabled={currentPage === totalPages}
											className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-900 cursor-not-allowed' : 'text-gray-50 hover:bg-gray-700'}`}
										>
											<ChevronRight size={18} />
										</button>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</motion.div>

			{/* Create User Modal */}
			<Modal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				title="Create New User"
			>
				<form onSubmit={handleCreateUser}>
					<div className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-900">
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								required
								className="mt-1 block w-full h-8 rounded-md bg-gray-400 bg-opacity-15 border-gray-100 text-black shadow-sm focus:border-none outline-none focus:ring-2 ring-gray-400"
							/>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-900">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								required
								className="mt-1 block w-full h-8 rounded-md bg-gray-400 bg-opacity-15 border-gray-100 text-black shadow-sm focus:border-none outline-none focus:ring-2 ring-gray-400"
							/>
						</div>

						<div>
							<label htmlFor="role" className="block text-sm font-medium text-gray-900">
								Role
							</label>
							<select
								id="role"
								name="role"
								value={formData.role}
								onChange={handleInputChange}
								className="mt-1 block w-full h-8 rounded-md bg-gray-400 bg-opacity-15 border-gray-100 text-black shadow-sm focus:border-none outline-none focus:ring-2 ring-gray-400"
							>
								<option value="customer">Customer</option>
								<option value="moderator">Moderator</option>
								<option value="admin">Admin</option>
							</select>
						</div>

						<div>
							<label htmlFor="status" className="block text-sm font-medium text-gray-900">
								Status
							</label>
							<select
								id="status"
								name="status"
								value={formData.status}
								onChange={handleInputChange}
								className="mt-1 block w-full h-8 rounded-md bg-gray-400 bg-opacity-15 border-gray-100 text-black shadow-sm focus:border-none outline-none focus:ring-2 ring-gray-400"
							>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
						</div>
					</div>

					<div className="mt-6 flex justify-end space-x-3">
						<button
							type="button"
							onClick={() => setIsCreateModalOpen(false)}
							className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-[#118ac1] text-white rounded-md hover:bg-[#118ac1]/50"
						>
							Create User
						</button>
					</div>
				</form>
			</Modal>

			{/* Edit User Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title="Edit User"
			>
				<form onSubmit={handleUpdateUser}>
					<div className="space-y-4">
						<div>
							<label htmlFor="edit-name" className="block text-sm font-medium text-gray-300">
								Name
							</label>
							<input
								type="text"
								id="edit-name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								required
								className="mt-1 block w-full h-8 rounded-md bg-gray-400 bg-opacity-15 border-gray-100 text-black  shadow-sm focus:border-none outline-none focus:ring-2 ring-gray-400"
							/>
						</div>

						<div>
							<label htmlFor="edit-email" className="block text-sm font-medium text-gray-300">
								Email
							</label>
							<input
								type="email"
								id="edit-email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								required
								className="mt-1 block w-full h-8 rounded-md bg-gray-400 bg-opacity-15 border-gray-100 text-black  shadow-sm focus:border-none outline-none focus:ring-2 ring-gray-400"
							/>
						</div>

						<div>
							<label htmlFor="edit-role" className="block text-sm font-medium text-gray-300">
								Role
							</label>
							<select
								id="edit-role"
								name="role"
								value={formData.role}
								onChange={handleInputChange}
								className="mt-1 block w-full h-8 rounded-md bg-gray-400 bg-opacity-15 border-gray-100 text-black  shadow-sm focus:border-none outline-none focus:ring-2 ring-gray-400"
							>
								<option value="customer">Customer</option>
								<option value="moderator">Moderator</option>
								<option value="admin">Admin</option>
							</select>
						</div>

						<div>
							<label htmlFor="edit-status" className="block text-sm font-medium text-gray-300">
								Status
							</label>
							<select
								id="edit-status"
								name="status"
								value={formData.status}
								onChange={handleInputChange}
								className="mt-1 block w-full h-8 rounded-md bg-gray-400 bg-opacity-15 border-gray-100 text-black  shadow-sm focus:border-none outline-none focus:ring-2 ring-gray-400"
							>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
						</div>
					</div>

					<div className="mt-6 flex justify-end space-x-3">
						<button
							type="button"
							onClick={() => setIsEditModalOpen(false)}
							className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-500"
						>
							Update User
						</button>
					</div>
				</form>
			</Modal>

			{/* Delete User Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="Delete User"
			>
				{currentUser && (
					<div>
						<p className="text-gray-900 mb-4">
							Are you sure you want to delete <span className="font-semibold">{currentUser.name}</span>? This action cannot be undone.
						</p>

						<div className="flex justify-end space-x-3">
							<button
								onClick={() => setIsDeleteModalOpen(false)}
								className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteUser}
								className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
							>
								Delete
							</button>
						</div>
					</div>
				)}
			</Modal>
		</>
	);
};

export default UsersTable;