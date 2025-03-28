import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";
import { handleApiError , fallbackData } from "../utils/apiUtils";
import { useEffect, useState } from "react";
import { saleService } from "../services/api";



const SalesPage = () => {
	const [stats, setStats] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [apiAvailable, setApiAvailable] = useState(true);




	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		setLoading(true);
		setError(null); // Clear any previous errors
		try {
			console.log("Fetching stats from API...");
			const response = await saleService.getStats();
			

			// Ensure we're setting an array for users and filteredUsers
			const statsData = response.data;
			console.log(statsData);
			setStats(statsData);
			setApiAvailable(true);
		} catch (err) {
			console.error("Error fetching users:", err);
			console.error("Error details:", err.response ? err.response.data : "No response data");
			console.error("Error status:", err.response ? err.response.status : "No status");

			// Set a more descriptive error message using the utility function
			setError(handleApiError(err));
			setApiAvailable(false);

			// Fallback to mock data if API fails
			const fallbackStatsData = Array.isArray(fallbackData.salesStats) ? fallbackData.salesStats : [];
			setStats(fallbackStatsData);
			
		} finally {
			setLoading(false); // Ensure loading is set to false
		}
	};
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Sales Dashboard' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* SALES STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Revenue' icon={DollarSign} value={stats.totalRevenue} color='green' />
					<StatCard
						name='Avg. Order Value'
						icon={ShoppingCart}
						value={stats.averageOrderValue}
						color='green'
					/>
					<StatCard
						name='Total Orders'
						icon={TrendingUp}
						value={stats.totalOrders  }
						color='green'
					/>
					<StatCard name='Sales Growth' icon={CreditCard} value={stats.revenueGrowth} color='green' />
				</motion.div>

				<SalesOverviewChart />

				<div className='grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8'>
					<SalesByCategoryChart />
					<DailySalesTrend />
				</div>
			</main>
		</div>
	);
};
export default SalesPage;
