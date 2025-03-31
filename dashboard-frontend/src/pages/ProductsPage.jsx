import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";

import ProductsTable from "../components/products/ProductsTable";
import { productService } from "../services/api";

const ProductsPage = () => {
	const [productStats, setProductStats] = useState({
		totalProducts: 0,
		activeProducts: 0,
		outOfStockProducts: 0,
		featuredProducts: 0
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProductStats = async () => {
			try {
				const response = await productService.getStats();
				setProductStats(response.data);
			} catch (error) {
				console.error("Error fetching product stats:", error);
				// Fallback to mock data if API fails
				setProductStats({
					totalProducts: 26,
					activeProducts: 26,
					outOfStockProducts: 0,
					featuredProducts: 5
				});
			} finally {
				setLoading(false);
			}
		};

		fetchProductStats();
	}, []);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Products' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard 
						name='Total Products' 
						icon={Package} 
						value={loading ? "Loading..." : productStats.totalProducts} 
						color='#72b7ef' 
					/>
					<StatCard 
						name='Existing Products' 
						icon={TrendingUp} 
						value={loading ? "Loading..." : productStats.activeProducts} 
						color='#72b7ef' 
					/>
					<StatCard 
						name='Out of Stock' 
						icon={AlertTriangle} 
						value={loading ? "Loading..." : productStats.outOfStockProducts} 
						color='#72b7ef' 
					/>
					<StatCard 
						name='Featured Products' 
						icon={Star} 
						value={loading ? "Loading..." : productStats.featuredProducts} 
						color='#72b7ef' 
					/>
				</motion.div>

				<ProductsTable />
			</main>
		</div>
	);
};
export default ProductsPage;
