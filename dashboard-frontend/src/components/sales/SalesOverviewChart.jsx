import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { saleService } from "../../services/api";

// Fallback data if API fails
const fallbackMonthlySalesData = [
	{ month: "Jan", sales: 4000 },
	{ month: "Feb", sales: 3000 },
	{ month: "Mar", sales: 5000 },
	{ month: "Apr", sales: 4500 },
	{ month: "May", sales: 6000 },
	{ month: "Jun", sales: 5500 },
	{ month: "Jul", sales: 7000 },
];

const SalesOverviewChart = () => {
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");
	const [monthlySalesData, setMonthlySalesData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchMonthlySalesData = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await saleService.getMonthlySales();
			setMonthlySalesData(response.data);
		} catch (error) {
			console.error("Error fetching monthly sales data:", error);
			setError("Failed to load sales data. Using mock data instead.");
			setMonthlySalesData(fallbackMonthlySalesData);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMonthlySalesData();
	}, []);

	return (
		<motion.div
			className='bg-gray-300 shadow-lg rounded-xl p-6 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex items-center justify-between mb-6'>
				<h2 className='text-xl font-semibold text-black'>Sales Overview</h2>

				<div className="flex items-center">
					{error && (
						<button
							onClick={fetchMonthlySalesData}
							className="flex items-center text-red-500 hover:text-indigo-300 text-sm mr-4"
						>
							<RefreshCw size={14} className="mr-1" /> Refresh
						</button>
					)}
					<select
						className='bg-gray-400 bg-opacity-15 text-black rounded-md px-3 py-1 focus:outline-none focus:ring-2 
						focus:ring-gray-400'
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

			<div className='w-full h-80'>
				{loading ? (
					<div className="flex items-center justify-center h-full">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
						<p className="ml-2 text-black">Loading chart data...</p>
					</div>
				) : (
					<ResponsiveContainer>
						<AreaChart data={monthlySalesData}>
						<CartesianGrid strokeDasharray='4 4' stroke='#1f2937' strokeOpacity={0.2} />
							<XAxis tick={{ fontSize: 13, fill: 'black' }}
								dataKey='name'
								stroke='white'
							/>
							<YAxis
								tick={{ fontSize: 14, fill: 'black' }}
								stroke='white'
								domain={[0, 150000]}
								ticks={[0, 30000, 60000, 90000, 120000, 150000]}
								tickFormatter={(value) => `$${value.toLocaleString()}`}
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
							<Area type='monotone' dataKey='sales' stroke='#72b7ef' fill='#118ac1' fillOpacity={0.2} />
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>
		</motion.div>
	);
};
export default SalesOverviewChart;
