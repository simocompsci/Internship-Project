import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, RefreshCw } from "lucide-react";
import { analyticsService } from "../../services/api";

// Fallback data if API fails
const fallbackChannelData = [
	{ name: "Organic Search", value: 4000 },
	{ name: "Paid Search", value: 3000 },
	{ name: "Direct", value: 2000 },
	{ name: "Social Media", value: 2780 },
	{ name: "Referral", value: 1890 },
	{ name: "Email", value: 2390 },
];
const COLORS =  ["#72b7ef", "#439ee7", "#1c95a1", "#3b7b82", "#118ac1", "#8bd7f9", "#2c5282"];

const ChannelPerformance = () => {
	const [channelData, setChannelData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchChannelData = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await analyticsService.getTrafficSources();
			
			// Make sure we're working with an array
			const dataArray = Array.isArray(response.data) ? response.data : [];
			
			// Transform the data to match the expected format
			const transformedData = dataArray.map(item => ({
			name: item.source || "Unknown",
			value: parseInt(item.count || item.visits || 0) // Try different property names
			})).filter(item => item.value > 0); // Filter out zero values
			

			
			if (transformedData.length === 0) {
			throw new Error("No valid data received");
			}
			
			setChannelData(transformedData);
		} catch (error) {
			console.error("Error fetching traffic sources:", error);
			setError("Failed to load traffic data. Using mock data instead.");
			setChannelData(fallbackChannelData);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchChannelData();
	}, []);

	return (
		<motion.div
			className='bg-gray-100 shadow-lg rounded-xl p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<div className="flex justify-between items-center mb-4">
				<h2 className='text-xl font-semibold text-gray-800'>Channel Performance</h2>
				{error && (
					<button 
						onClick={fetchChannelData}
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
								data={channelData}
								cx='50%'
								cy='50%'
								innerRadius = '25%'
								stroke="#3b7b82"
								outerRadius={100}
								fill='#8884d8'
								dataKey='value'
								nameKey='name'
								label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
							>
								{channelData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									backgroundColor: "rgba(26, 110, 57, 0.8)",
									borderColor: "emerald",
								}}
								itemStyle={{ color: "#E5E7EB" }}
								formatter={(value) => [value, "Visits"]}
							/>
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				)}
			</div>
		</motion.div>
	);
};
export default ChannelPerformance;
