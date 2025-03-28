import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, RefreshCw } from "lucide-react";
import { saleService } from "../../services/api";

// Fallback data if API fails
const fallbackSalesByCategory = [
	{ name: "Electronics", value: 400 },
	{ name: "Clothing", value: 300 },
	{ name: "Home & Garden", value: 200 },
	{ name: "Books", value: 100 },
	{ name: "Others", value: 150 },
];

const COLORS =  ["#72b7ef", " #439ee7", "#1c95a1", "#3b7b82", "#118ac1" , "#8bd7f9"];

const SalesByCategoryChart = () => {
	const [salesByCategory, setSalesByCategory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchSalesByCategory = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await saleService.getSalesByCategory();
			
			
			// Transform the data to match the expected format
			const formattedData = response.data.map(item => ({
			  name: item.category || "Uncategorized",
			  value: parseFloat(item.revenue) || 0
			}));
			
			setSalesByCategory(formattedData);
		} catch (error) {
			console.error("Error fetching sales by category data:", error);
			setError("Failed to load category data. Using mock data instead.");
			setSalesByCategory(fallbackSalesByCategory);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSalesByCategory();
	}, []);

	return (
		<motion.div
			className='bg-success bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<div className="flex justify-between items-center mb-4">
				<h2 className='text-xl font-semibold text-gray-100'>Sales by Category</h2>
				{error && (
					<button 
						onClick={fetchSalesByCategory}
						className="flex items-center text-red-500 hover:text-red-300 text-sm"
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
								data={salesByCategory}
								cx='50%'
								cy='50%'
								stroke="#D9DAD9"
								innerRadius = '25%'
								outerRadius={100}
								fill='#8884d8'
								dataKey='value'
								nameKey='name'
								label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
							>
								{salesByCategory.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									backgroundColor: "rgba(26, 110, 57, 0.8)",
									borderColor: "emerald",
								}}
								itemStyle={{ color: "white" }}
								formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
							/>
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				)}
			</div>
		</motion.div>
	);
};
export default SalesByCategoryChart;
