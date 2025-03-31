import { useState, useEffect } from "react";
import { motion, resolveMotionValue } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";

// Fallback data if API fails
const fallbackCategoryData = [
	{ name: "Electronics", value: 4500 },
	{ name: "Clothing", value: 3200 },
	{ name: "Home & Garden", value: 2800 },
	{ name: "Books", value: 2100 },
	{ name: "Sports & Outdoors", value: 1900 },
];

const COLORS = ["#72b7ef", "#439ee7", "#1c95a1", "#3b7b82", "#118ac1", "#8bd7f9", "#2c5282"];

const CategoryDistributionChart = () => {
	const [categoryData, setCategoryData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCategoryData = async () => {
			try {
				const response = await axios.get('http://127.0.0.1:8000/api/sales/stats/by-category');
				
				// Transform the data to match the expected format for the pie chart
				const formattedData = response.data.map(item => ({
					name: item.category,
					value: Number(item.revenue)
				}));
				
				setCategoryData(formattedData);
			} catch (error) {
				console.error("Error fetching category distribution data:", error);
				// Use fallback data if API fails
				setCategoryData(fallbackCategoryData);
			} finally {
				setLoading(false);
			}
		};

		fetchCategoryData();
	}, []);

	return (
		<motion.div
			className='bg-gray-300 shadow-lg rounded-xl p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-800'>Category Distribution</h2>
			<div className='h-80'>
				{loading ? (
					<div className="flex items-center justify-center h-full">
						<p className="text-gray-600">Loading chart data...</p>
					</div>
				) : (
					<ResponsiveContainer width={"100%"} height={"100%"}>
						<PieChart>
							<Pie
								data={categoryData}
								cx={"50%"}
								cy={"50%"}
								innerRadius = '25%'
								stroke="#3b7b82"
								cornerRadius={0}
								labelLine={false}
								outerRadius={100}
								fill='#8884d8'
								dataKey='value'
								label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
							>
								{categoryData.map((entry, index) => (
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
								formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
							/>
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				)}
			</div>
		</motion.div>
	);
};
export default CategoryDistributionChart;
