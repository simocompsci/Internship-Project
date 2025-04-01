import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import axios from "axios";

// This will be replaced with API data
const fallbackData = [
	{ name: "January", sales: 6100 },
	{ name: "February", sales: 5900 },
	{ name: "March", sales: 6800 },
	{ name: "April", sales: 6300 },
	{ name: "May", sales: 7100 },
	{ name: "June", sales: 7500 },
	{ name: "July", sales: 4200 },
	{ name: "August", sales: 3800 },
	{ name: "September", sales: 5100 },
	{ name: "October", sales: 4600 },
	{ name: "November", sales: 5400 },
	{ name: "December", sales: 7200 },
];

const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const SalesOverviewChart = () => {
	const [salesData, setSalesData] = useState(fallbackData);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	
	useEffect(() => {
		const fetchSalesData = async () => {
			try {
				setLoading(true);
				const response = await axios.get('http://127.0.0.1:8000/api/sales/stats/monthly');
				
				console.log("API Response:", response.data); // Debug the API response
				
				// Create a map of the response data for easy lookup
				const dataMap = {};
				
				// Check if response.data is an array
				if (Array.isArray(response.data)) {
					response.data.forEach(item => {
						// Make sure we're accessing the correct properties
						if (item && item.name && item.sales !== undefined) {
							dataMap[item.name] = item.sales;
						}
					});
				} else if (typeof response.data === 'object') {
					// If response.data is an object with month keys
					Object.keys(response.data).forEach(key => {
						if (monthOrder.includes(key)) {
							dataMap[key] = response.data[key];
						}
					});
				}
				
				console.log("Data Map:", dataMap); // Debug the data map
				
				// Ensure all months are present with proper ordering
				const completeData = monthOrder.map(month => ({
					name: month,
					sales: dataMap[month] !== undefined ? dataMap[month] : 0
				}));
				
				console.log("Complete Data:", completeData); // Debug the complete data
				
				setSalesData(completeData);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching sales data:", err);
				setError("Failed to load sales data");
				setLoading(false);
				// Fallback to sample data if API fails
				setSalesData(fallbackData);
			}
		};

		fetchSalesData();
	}, []);

	return (
		<motion.div
			className='bg-gray-100 bg-opacity-50 rounded-xl p-6 border border-gray-200'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-800'>Sales Overview</h2>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
				</div>
			) : error ? (
				<div className="text-red-400 text-center h-64 flex items-center justify-center">
					{error}
				</div>
			) : (
				<div className='h-80'>
					<ResponsiveContainer width={"100%"} height={"100%"}>
						<LineChart data={salesData}>
							<CartesianGrid 
							strokeDasharray='2 4' 
							stroke='rgba(0, 0, 0, 0.2)' 
							strokeWidth={0.5}
						/>
						
							<XAxis 
								dataKey={"name"} 
								stroke='black'
								tick={{ fontSize: 10, fill: 'black' }}
								tickMargin={10}
								padding={{ left: 0, right: 0 }}
								angle={-45}
								// Force display of all months in order
								ticks={monthOrder}
								interval={0}
							/>
							<YAxis 
								stroke='black'
								tickFormatter={(value) => `$${value.toLocaleString()}`}
								domain={[0, 120000]}
								tick={{ fontSize: 10, fill: 'black' }}
								tickMargin={10}
								ticks={[0, 20000, 40000, 60000, 80000, 100000, 120000 , 140000 , 160000]}
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
							<Line
								type='monotone'
								dataKey='sales'
								stroke='#72b7ef'
								strokeWidth={3}
								
								activeDot={{ r: 8, strokeWidth: 2, stroke: 'black' }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</motion.div>
	);
};
export default SalesOverviewChart;
