import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AlertCircle, RefreshCw } from "lucide-react";
import { orderService } from "../../services/api";

// Fallback data if API fails
const fallbackOrderStatusData = [
	{ name: "Pending", value: 30 },
	{ name: "Processing", value: 45 },
	{ name: "Shipped", value: 60 },
	{ name: "Delivered", value: 120 },
];
const COLORS = ["#72b7ef", "#439ee7", "#1c95a1", "#3b7b82", "#118ac1", "#8bd7f9", "#2c5282"];

const OrderDistribution = () => {
	const [orderStatusData, setOrderStatusData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchOrderStatusData = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await orderService.getStatusDistribution();
			
			
			// Transform the data to match the expected format for the chart
			const formattedData = response.data.map(item => ({
			  name: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalize first letter
			  value: item.count
			}));
			
			setOrderStatusData(formattedData);
		} catch (error) {
			console.error("Error fetching order status distribution:", error);
			setError("Failed to load status data. Using mock data instead.");
			setOrderStatusData(fallbackOrderStatusData);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrderStatusData();
	}, []);

	return (
		<motion.div
			className='bg-gray-100 shadow-lg rounded-xl p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<div className="flex justify-between items-center mb-4">
				<h2 className='text-xl font-semibold text-gray-900'>Order Status Distribution</h2>
				{error && (
					<button 
						onClick={fetchOrderStatusData}
						className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm"
					>
						<RefreshCw size={14} className="mr-1" /> Refresh
					</button>
				)}
			</div>

			{error && (
				<div className="bg-red-900 bg-opacity-50 text-red-200 p-2 rounded-md mb-4 flex items-center text-sm">
					<AlertCircle size={14} className="mr-2" />
					{error}
				</div>
			)}

			<div style={{ width: "100%", height: 300 }}>
				{loading ? (
					<div className="flex items-center justify-center h-full">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
						<p className="ml-2 text-gray-400">Loading chart data...</p>
					</div>
				) : (
					<ResponsiveContainer>
						<PieChart>
							<Pie
								data={orderStatusData}
								cx='50%'
								cy='50%'
								innerRadius = '25%'
								outerRadius={100}
								fill='#8884d8'
								stroke="#3b7b82"
								dataKey='value'
								nameKey='name'
								label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
							>
								{orderStatusData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									backgroundColor: "#72b7ef",
									borderRadius: "8px",
									boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
									border: "none",
									padding: "12px"
								}}
								itemStyle={{ color: "#1F2937" }}
								formatter={(value) => [value, "Orders"]}
							/>
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				)}
			</div>
		</motion.div>
	);
};
export default OrderDistribution;
