import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, RefreshCw } from "lucide-react";
import { analyticsService } from "../../services/api";

// Fallback data if API fails
const fallbackRevenueData = [
	{ month: "Jan", revenue: 4000, target: 3800 },
	{ month: "Feb", revenue: 3000, target: 3200 },
	{ month: "Mar", revenue: 5000, target: 4500 },
	{ month: "Apr", revenue: 4500, target: 4200 },
	{ month: "May", revenue: 6000, target: 5500 },
	{ month: "Jun", revenue: 5500, target: 5800 },
	{ month: "Jul", revenue: 7000, target: 6500 },
];

const RevenueChart = () => {
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");
	const [revenueData, setRevenueData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchRevenueData = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await analyticsService.getSalesVsTargets();


			// Make sure we're working with an array
			const dataArray = Array.isArray(response.data) ? response.data : [];

			// Transform the data to match the expected format
			const transformedData = dataArray.map(item => ({
				month: item.month,
				revenue: parseFloat(item.actual) || 0, // Ensure numeric values
				target: parseFloat(item.target) || 0
			}));


			setRevenueData(transformedData);
		} catch (error) {
			console.error("Error fetching revenue data:", error);
			setError("Failed to load revenue data. Using mock data instead.");
			setRevenueData(fallbackRevenueData);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRevenueData();
	}, []);

	return (
		<motion.div
			className='bg-success bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Revenue vs Target</h2>
				<div className="flex items-center">
					{error && (
						<button
							onClick={fetchRevenueData}
							className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm mr-4"
						>
							<RefreshCw size={14} className="mr-1" /> Refresh
						</button>
					)}
					<select
						className='bg-emerald-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500'
						value={selectedTimeRange}
						onChange={(e) => setSelectedTimeRange(e.target.value)}
					>
						<option>This Week</option>
						<option>This Month</option>
						<option>This Quarter</option>
						<option>This Year</option>
					</select>
				</div>
			</div>

			{error && (
				<div className="bg-red-900 bg-opacity-50 text-red-200 p-2 rounded-md mb-4 flex items-center text-sm">
					<AlertCircle size={14} className="mr-2" />
					{error}
				</div>
			)}

			<div style={{ width: "100%", height: 400 }}>
				{loading ? (
					<div className="flex items-center justify-center h-full">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
						<p className="ml-2 text-gray-400">Loading chart data...</p>
					</div>
				) : (
					<ResponsiveContainer>
						<AreaChart data={revenueData}>
							<CartesianGrid strokeDasharray='3 3' stroke='white' />
							<XAxis dataKey='month' stroke='white' />
							<YAxis
								tickSize={10}
								stroke='white'
								tickFormatter={(value) => `$${value.toLocaleString()}`}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "rgba(26, 110, 57, 0.8)",
									borderColor: "emerald",
								}}
								itemStyle={{ color: "#E5E7EB" }}
								formatter={(value) => [`$${value.toLocaleString()}`, ""]}
							/>
							<Legend />
							<Area
								type='monotone'
								dataKey='revenue'
								name='Actual Revenue'
								stroke='green'
								fill='white'
								fillOpacity={0.3}
							/>
							<Area
								type='monotone'
								dataKey='target'
								name='Target Revenue'
								stroke='green'
								fill='green'
								fillOpacity={0.3}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>
		</motion.div>
	);
};
export default RevenueChart;
