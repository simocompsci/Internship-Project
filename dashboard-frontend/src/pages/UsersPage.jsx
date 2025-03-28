import { useState, useEffect } from "react";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import { userService } from "../services/api";

const UsersPage = () => {
	const [userStats, setUserStats] = useState({
		totalUsers: 0,
		newUsersToday: 0,
		activeUsers: 0,
		churnRate: "0%",
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserStats = async () => {
			try {
				const response = await userService.getStats();
				setUserStats(response.data);
			} catch (error) {
				console.error("Error fetching user stats:", error);
				// Fallback to mock data if API fails
				setUserStats({
					totalUsers: 152845,
					newUsersToday: 243,
					activeUsers: 98520,
					churnRate: "2.4%",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchUserStats();
	}, []);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Users'
						icon={UsersIcon}
						value={loading ? "Loading..." : userStats.totalUsers?.toLocaleString()}
						color='green'
					/>
					<StatCard
						name='New Users Today'
						icon={UserPlus}
						value={loading ? "Loading..." : userStats.newUsersToday}
						color='green'
					/>
					<StatCard
						name='Active Users'
						icon={UserCheck}
						value={loading ? "Loading..." : userStats.activeUsers?.toLocaleString()}
						color='green'
					/>
					<StatCard
						name='Churn Rate'
						icon={UserX}
						value={loading ? "Loading..." : userStats.churnRate}
						color='green'
					/>
				</motion.div>

				<UsersTable />

			</main>
		</div>
	);
};
export default UsersPage;
