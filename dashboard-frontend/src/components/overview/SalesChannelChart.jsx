import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const COLORS = ["#72b7ef", "#439ee7", "#1c95a1", "#3b7b82", "#118ac1", "#8bd7f9", "#1a6e39"];

const SALES_CHANNEL_DATA = [
	{ name: "Website", value: 45600 },
	{ name: "Mobile App", value: 38200 },
	{ name: "Marketplace", value: 29800 },
	{ name: "Social Media", value: 18700 },
	{ name: "Sponcorship", value: 30000 },
	{ name: "Radio", value: 35000 },
	{ name: "Local Stores", value: 10600 },
];

const SalesChannelChart = () => {
	return (
		<motion.div
			className='bg-gray-100 bg-opacity-50 border border-gray-200 rounded-xl p-6 lg:col-span-2'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-800'>Sales by Channel</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<BarChart data={SALES_CHANNEL_DATA}>
						<CartesianGrid strokeDasharray='4 4' stroke='#1f2937' strokeOpacity={0.2} />
						<XAxis 
							dataKey='name' 
							stroke='#000000'
							tick={{ fontSize: 13, fill: '#000000' }}
						/>
						<YAxis
							stroke='#000000'
							tick={{ fontSize: 14, fill: '#000000' }}
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
						<Legend />
						<Bar 
							dataKey={"value"} 
							fill='#8884d8'
							radius={[4, 4, 0, 0]}
						>
							{SALES_CHANNEL_DATA.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesChannelChart;
