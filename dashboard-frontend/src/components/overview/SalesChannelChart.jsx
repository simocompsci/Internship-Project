import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const COLORS =  ["#8bd7f9", "#4ec0f4", "#3e9eca", "#80d6fd", "#427084" , "#1c5f7c" , "#089bda"];

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
			className='bg-success bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Sales by Channel</h2>

			<div className='h-80'>
				<ResponsiveContainer>
					<BarChart data={SALES_CHANNEL_DATA}>
						<CartesianGrid strokeDasharray='3 3' stroke='white' />
						<XAxis dataKey='name' stroke='white' />
						<YAxis stroke='white' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(26, 110, 57, 0.8)",
								borderColor: "emerald",
							}}
							itemStyle={{ color: "white" }}
						/>
						<Legend />
						<Bar dataKey={"value"} fill='#8884d8'>
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
