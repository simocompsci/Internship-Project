import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
	return (
		<motion.div
			className='bg-gray-300 overflow-hidden text-gray-800 shadow-lg rounded-xl border border-gray-300'
			whileHover={{ y: -5 }}
		>
			<div className='px-4 py-5 sm:p-6'>
				<span className='flex items-center text-sm font-medium text-gray-600'>
					<Icon size={20} className='mr-2' style={{ color }} />
					{name}
				</span>
				<p className='mt-1 text-3xl font-semibold text-gray-800'>{value}</p>
			</div>
		</motion.div>
	);
};
export default StatCard;
