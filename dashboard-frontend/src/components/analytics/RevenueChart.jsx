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
			className='bg-gray-100 bg-opacity-50 border border-gray-200 rounded-xl p-6 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-black'>Revenue vs Target</h2>
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
						className='bg-gray-400 bg-opacity-15 text-black rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400'
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
							<defs>
								<linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
									<stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
								</linearGradient>
								<linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
									<stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray='4 4' stroke='#1f2937' strokeOpacity={0.2} />
							<XAxis
								dataKey="month"
								stroke="black"
								tick={{ fill: 'black', fontSize: 12 }}
								axisLine={{ stroke: '#000000' }}
							/>
							<YAxis
								tickSize={10}
								stroke="black"
								tickFormatter={(value) => `$${value.toLocaleString()}`}
								tick={{ fill: 'black', fontSize: 12 }}
								axisLine={{ stroke: '#000000' }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "#72b7ef",
									borderRadius: "8px",
									boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
									border: "none",
									padding: "12px"
								}}
								itemStyle={{ color: "#1F2937" }}
								formatter={(value) => [`$${value.toLocaleString()}`, ""]}
								labelStyle={{ color: "#4B5563", marginBottom: "4px" }}
							/>
							<Legend
								verticalAlign="top"
								height={36}
								iconType="circle"
							/>
							<Area
								type="monotone"
								dataKey="revenue"
								name="Actual Revenue"
								stroke="#10B981"
								fill="url(#revenueGradient)"
								strokeWidth={2}
								dot={{ stroke: '#10B981', strokeWidth: 2, r: 4, fill: '#fff' }}
								activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
							/>
							<Area
								type="monotone"
								dataKey="target"
								name="Target Revenue"
								stroke="#6366F1"
								fill="url(#targetGradient)"
								strokeWidth={2}
								dot={{ stroke: '#6366F1', strokeWidth: 2, r: 4, fill: '#fff' }}
								activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 2, fill: '#fff' }}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>
		</motion.div>
	);
};
export default RevenueChart;
