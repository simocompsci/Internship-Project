import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, RefreshCw, AlertCircle } from "lucide-react";
import { orderService } from "../../services/api";

// Fallback data if API fails
const fallbackOrderData = [
	{ id: "ORD001", customer: "John Doe", total: 235.4, status: "Delivered", date: "2023-07-01" },
	{ id: "ORD002", customer: "Jane Smith", total: 412.0, status: "Processing", date: "2023-07-02" },
	{ id: "ORD003", customer: "Bob Johnson", total: 162.5, status: "Shipped", date: "2023-07-03" },
	{ id: "ORD004", customer: "Alice Brown", total: 750.2, status: "Pending", date: "2023-07-04" },
	{ id: "ORD005", customer: "Charlie Wilson", total: 95.8, status: "Delivered", date: "2023-07-05" },
	{ id: "ORD006", customer: "Eva Martinez", total: 310.75, status: "Processing", date: "2023-07-06" },
	{ id: "ORD007", customer: "David Lee", total: 528.9, status: "Shipped", date: "2023-07-07" },
	{ id: "ORD008", customer: "Grace Taylor", total: 189.6, status: "Delivered", date: "2023-07-08" },
];

const OrdersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [orders, setOrders] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchOrders = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await orderService.getRecent();
			
			// Process orders to extract user information from the nested user object
			// In the fetchOrders function, update the processedOrders mapping
			const processedOrders = response.data.map(order => {
			  return {
			    ...order,
			    // Use the nested user object if available
			    customer: order.user ? order.user.name : `User ${order.user_id}`,
			    userEmail: order.user ? order.user.email : '',
			    // Format the date from created_at
			    orderDate: new Date(order.created_at).toLocaleDateString(),
			    // Map total_amount to total for consistency
			    total: order.total_amount || order.total || 0
			  };
			});
			
			setOrders(processedOrders);
			setFilteredOrders(processedOrders);
		} catch (error) {
			console.error("Error fetching orders:", error);
			setError("Failed to load orders. Using mock data instead.");
			setOrders(fallbackOrderData);
			setFilteredOrders(fallbackOrderData);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = orders.filter((order) => {
		    // Convert id to string before using toLowerCase
		    const idMatch = order.id ? String(order.id).toLowerCase().includes(term) : false;
		    // Check if customer name includes search term
		    const customerMatch = order.customer ? order.customer.toLowerCase().includes(term) : false;
		    // Check if email includes search term
		    const emailMatch = order.userEmail ? order.userEmail.toLowerCase().includes(term) : false;
		    
		    return idMatch || customerMatch || emailMatch;
		  });
		setFilteredOrders(filtered);
	};

	return (
		<motion.div
			className='bg-gray-100 border border-gray-200 rounded-xl p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-900'>Recent Orders</h2>
				<div className='flex items-center'>
					{error && (
						<button 
							onClick={fetchOrders}
							className="flex items-center text-gray-900 hover:text-gray-700 text-sm mr-4"
						>
							<RefreshCw size={14} className="mr-1" /> Refresh
						</button>
					)}
					<div className='relative'>
						<input
							type='text'
							placeholder='Search orders...'
							className="bg-gray-400 bg-opacity-15 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
							value={searchTerm}
							onChange={handleSearch}
						/>
						<Search className='absolute left-3 top-2.5 text-gray-600' size={18} />
					</div>
				</div>
			</div>

			{error && (
				<div className="bg-red-900 bg-opacity-50 text-red-100 p-2 rounded-md mb-4 flex items-center text-sm">
					<AlertCircle size={14} className="mr-2" />
					{error}
				</div>
			)}

			<div className='overflow-x-auto'>
				{loading ? (
					<div className="flex items-center justify-center h-40">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
						<p className="ml-2 text-gray-400">Loading orders...</p>
					</div>
				) : (
					<table className='min-w-full border-separate border-spacing-y-1 border-spacing-x-0'>
						<thead>
							<tr className="bg-gray-900">
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider rounded-s-lg'>
									Order ID
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
									Customer
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
									Total
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
									Status
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider rounded-e-lg'>
									Date
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-800'>
							{filteredOrders.map((order, index) => (
								<motion.tr
									key={order.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
									className={`${index % 2 === 0 ? 'bg-gray-400 bg-opacity-10' : 'bg-gray-100'} overflow-hidden rounded-xl`}
								>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-l-xl'>
										{order.id}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
										<div>
											<div>{order.customer}</div>
											{order.userEmail && (
												<div className="text-xs text-gray-400">{order.userEmail}</div>
											)}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
										${parseFloat(order.total || order.total_amount || 0).toFixed(2)}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === "pending" ? "bg-yellow-100 text-yellow-800" : order.status === "cancelled" ? "bg-red-100 text-red-800" : order.status === "Shipped" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
										>
											{order.status}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-r-xl'>
										{order.orderDate}
										{order.created_at && (
											<div className="text-xs text-gray-400">
												{new Date(order.created_at).toLocaleTimeString()}
											</div>
										)}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</motion.div>
	);
};
export default OrdersTable;
