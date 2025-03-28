import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";
import { useState , useEffect } from "react";
import { handleApiError , fallbackData } from "../utils/apiUtils";
import { orderService } from "../services/api";

const OrdersPage = () => {
	const [ordersStats, setordersStats] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [apiAvailable, setApiAvailable] = useState(true);




	useEffect(() => {
		fetchOrdersStats();
	}, []);

	const fetchOrdersStats = async () => {
		setLoading(true);
		setError(null); // Clear any previous errors
		try {
			console.log("Fetching stats from API...");
			const response = await orderService.getStats();
			

			// Ensure we're setting an array for users and filteredUsers
			const OrdersstatsData = response.data;
			
			setordersStats(OrdersstatsData);
			setApiAvailable(true);
		} catch (err) {
			console.error("Error fetching users:", err);
			console.error("Error details:", err.response ? err.response.data : "No response data");
			console.error("Error status:", err.response ? err.response.status : "No status");

			// Set a more descriptive error message using the utility function
			setError(handleApiError(err));
			setApiAvailable(false);

			// Fallback to mock data if API fails
			const fallbackOrdersStatsData = fallbackData.orderStats;
			setStats(fallbackOrdersStatsData);

		} finally {
			setLoading(false); // Ensure loading is set to false
		}
	};
	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			<Header title={"Orders"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Orders' icon={ShoppingBag} value={ordersStats.totalOrders} color='green' />
					<StatCard name='Pending Orders' icon={Clock} value={ordersStats.pendingOrders} color='green' />
					<StatCard
						name='Completed Orders'
						icon={CheckCircle}
						value={ordersStats.completedOrders}
						color='green'
					/>
					<StatCard name='Total Revenue' icon={DollarSign} value={ordersStats.totalRevenue} color='green' />
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8'>
				<OrdersTable />
					
				</div>
				<OrderDistribution />
				
			</main>
		</div>
	);
};
export default OrdersPage;
