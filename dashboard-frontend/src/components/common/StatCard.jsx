import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
	return (
		<motion.div
			className=' bg-success-50 bg-opacity-50 backdrop-blur-md overflow-hidden text-white shadow-lg rounded-2xl border border-emerald-600'
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className='px-4 py-5 sm:p-6'>
				<span className='flex items-center text-sm font-medium text-gray-300'>
					<Icon size={20} className='mr-2' style={{ color }} />
					{name}
				</span>
				<p className='mt-1 text-3xl font-semibold text-gray-100'>{value}</p>
			</div>
		</motion.div>
	);
};
export default StatCard;
