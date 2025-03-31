import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, RefreshCw } from "lucide-react";
import { saleService } from "../../services/api";

// Fallback data if API fails
const fallbackDailySalesData = [
	{ name: "Mon", sales: 1000 },
	{ name: "Tue", sales: 1200 },
	{ name: "Wed", sales: 900 },
	{ name: "Thu", sales: 1100 },
	{ name: "Fri", sales: 1300 },
	{ name: "Sat", sales: 1600 },
	{ name: "Sun", sales: 1400 },
];

const DailySalesTrend = () => {
	const [dailySalesData, setDailySalesData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchDailySalesData = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await saleService.getDailySales();
			setDailySalesData(response.data);
		} catch (error) {
			console.error("Error fetching daily sales data:", error);
			setError("Failed to load daily sales data. Using mock data instead.");
			setDailySalesData(fallbackDailySalesData);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDailySalesData();
	}, []);

	return (
		<motion.div
			className='bg-gray-100 shadow-lg rounded-xl p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className="flex justify-between items-center mb-4">
				<h2 className='text-xl font-semibold text-black'>Daily Sales Trend</h2>
				{error && (
					<button
						onClick={fetchDailySalesData}
						className="flex items-center text-red-400 hover:text-red-300 text-sm"
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
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
						<p className="ml-2 text-gray-400">Loading chart data...</p>
					</div>
				) : (
					<ResponsiveContainer>
						<BarChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='4 4' stroke='#1f2937' strokeOpacity={0.2} />
							<XAxis
								dataKey='name'
								stroke='black'
								tickSize={11}
								interval={0}
								angle={-45}
								textAnchor="end"
								height={60}
							/>
							<YAxis
								stroke='black'
								tickSize={11}
								domain={[0, 10000]}
								tickFormatter={(value) => `$${value}`}
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
								formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
							/>
							<Bar dataKey='sales'
							fill='#8884d8'
							radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				)}
			</div>
		</motion.div>
	);
};
export default DailySalesTrend;
