import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { productService } from "../../services/api";
import { handleApiError, fallbackData } from "../../utils/apiUtils";
import Modal from "../common/Modal";

const ProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiAvailable, setApiAvailable] = useState(true);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        image_url: "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww"
    });

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getAll();
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please try again later.");
            // Fallback to mock data if API fails
            const mockData = [
                { id: 1, name: "Wireless Earbuds", category: "Electronics", price: 59.99, stock: 143, sales: 1200 },
                { id: 2, name: "Leather Wallet", category: "Accessories", price: 39.99, stock: 89, sales: 800 },
                { id: 3, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 56, sales: 650 },
                { id: 4, name: "Yoga Mat", category: "Fitness", price: 29.99, stock: 210, sales: 950 },
                { id: 5, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720 },
            ];
            setProducts(mockData);
            setFilteredProducts(mockData);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = products.filter(
            (product) => 
                product.name.toLowerCase().includes(term) || 
                product.category.toLowerCase().includes(term)
        );
        setFilteredProducts(filtered);
    };

    // Form handling
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) || '' : value 
        });
    };

    // Create product
    const openCreateModal = () => {
        setFormData({
            name: "",
            category: "",
            price: "",
            stock: "",
            image_url: "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww"
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await productService.create(formData);
            setProducts([...products, response.data]);
            setFilteredProducts([...filteredProducts, response.data]);
            setIsCreateModalOpen(false);
            // Reset form
            setFormData({
                name: "",
                category: "",
                price: "",
                stock: "",
                image_url: "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww"
            });
        } catch (err) {
            console.error("Error creating product:", err);
            alert("Failed to create product. Please try again.");
        }
    };

    // Edit product
    const openEditModal = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            image_url: product.image_url || "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww"
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await productService.update(currentProduct.id, formData);
            
            // Update local state
            const updatedProducts = products.map(product => 
                product.id === currentProduct.id ? { ...product, ...response.data } : product
            );
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts.filter(
                (product) => 
                    product.name.toLowerCase().includes(searchTerm) || 
                    product.category.toLowerCase().includes(searchTerm)
            ));
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Error updating product:", err);
            alert("Failed to update product. Please try again.");
        }
    };

    // Delete product
    const openDeleteModal = (product) => {
        setCurrentProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteProduct = async () => {
        try {
            await productService.delete(currentProduct.id);
            
            // Update local state
            const updatedProducts = products.filter(product => product.id !== currentProduct.id);
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts.filter(
                (product) => 
                    product.name.toLowerCase().includes(searchTerm) || 
                    product.category.toLowerCase().includes(searchTerm)
            ));
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product. Please try again.");
        }
    };

    // Get current products for pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <>
            <motion.div
                className="bg-success shadow-lg rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                    <div className="flex space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="bg-emerald-600 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-50" size={18} />
                        </div>
                        <button
                            onClick={openCreateModal}
                            className={`${
                                apiAvailable ? "bg-primary hover:bg-primary/85" : "bg-gray-600 cursor-not-allowed"
							} text-white px-4 py-2 rounded-lg flex items-center`}
                        >
                            <Plus size={18} className="mr-1" /> Add Product
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                            <p className="mt-2 text-gray-400">Loading products...</p>
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full border-separate border-spacing-y-1 border-spacing-x-0">
                                <thead>
                                    <tr className="bg-emerald-600">
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider rounded-s-lg'>
                                            Name
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
                                            Category
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
                                            Price
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
                                            Stock
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
                                            Sales
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider rounded-e-lg'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className='divide-y divide-emerald-700'>
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-900">
                                                No products found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentProducts.map((product ,index) => (
                                            <motion.tr
                                                key={product.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className={`${index % 2 === 0 ? 'bg-success' : 'bg-success-400'} overflow-hidden rounded-xl`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-l-xl">
													<div className="flex gap-2 items-cente">
														<div className="ml-4">
															<div className="text-sm font-medium text-gray-900">{product.name}</div>
														</div>
													</div>
												</td>

                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                    {product.category}
                                                </td>

                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                    ${parseFloat(product.price).toFixed(2)}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{product.stock}</td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{product.sales || 0}</td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-r-xl'>
                                                    <button 
                                                        className='text-green-900 hover:text-green-500 mr-2'
                                                        onClick={() => openEditModal(product)}
                                                    >
                                                        <Edit size={20} />
                                                    </button>
                                                    <button 
                                                        className='text-red-700 hover:text-red-500'
                                                        onClick={() => openDeleteModal(product)}
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            
                            {/* Pagination Controls */}
                            {filteredProducts.length > 0 && (
                                <div className="flex items-center justify-between mt-4 px-2">
                                    <div className="text-md text-gray-700">
                                        Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={prevPage} 
                                            disabled={currentPage === 1}
                                            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-50 cursor-not-allowed' : 'text-gray-300 hover:bg-emerald-700'}`}
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        
                                        {/* Page numbers */}
                                        <div className="flex space-x-1">
                                            {[...Array(totalPages).keys()].map(number => (
                                                <button
                                                    key={number + 1}
                                                    onClick={() => paginate(number + 1)}
                                                    className={`px-3 py-1 rounded-md ${
                                                        currentPage === number + 1 
                                                            ? 'bg-emerald-600 text-white' 
                                                            : 'text-gray-300 hover:bg-emerald-700'
                                                    }`}
                                                >
                                                    {number + 1}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <button 
                                            onClick={nextPage} 
                                            disabled={currentPage === totalPages}
                                            className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-50 cursor-not-allowed' : 'text-gray-300 hover:bg-emerald-700'}`}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>

            {/* Create Product Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Product"
            >
                <form onSubmit={handleCreateProduct}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full h-8 rounded-md bg-emerald-800 border-emerald-100 text-white shadow-sm focus:border-none outline-none focus:ring-2 ring-green-700"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full h-8 rounded-md bg-emerald-800 border-emerald-100 text-white shadow-sm focus:border-none outline-none focus:ring-2 ring-green-700"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full h-8 rounded-md bg-emerald-800 border-emerald-100 text-white shadow-sm focus:border-none outline-none focus:ring-2 ring-green-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-300">Stock</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full h-8 rounded-md bg-emerald-800 border-emerald-100 text-white shadow-sm focus:border-none outline-none focus:ring-2 ring-green-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="image_url" className="block text-sm font-medium text-gray-300">Image URL</label>
                            <input
                                type="text"
                                id="image_url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleInputChange}
                                className="mt-1 block w-full h-8 rounded-md bg-emerald-800 border-emerald-100 text-white shadow-sm focus:border-none outline-none focus:ring-2 ring-green-700"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-900 text-white rounded-md hover:bg-emerald-700"
                        >
                            Create Product
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Product Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Product"
            >
                {currentProduct && (
                    <form onSubmit={handleUpdateProduct}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300">Name</label>
                                <input
                                    type="text"
                                    id="edit-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full h-8 rounded-md bg-emerald-800 border-emerald-100 text-white shadow-sm focus:border-none outline-none focus:ring-2 ring-green-700"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-300">Category</label>
                                <input
                                    type="text"
                                    id="edit-category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full h-8 rounded-md bg-emerald-800 border-emerald-100 text-white shadow-sm focus:border-none outline-none focus:ring-2 ring-green-700"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="edit-price" className="block text-sm font-medium text-gray-300">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="edit-price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full h-8 rounded-md bg-emerald-800 border-emerald-100 text-white shadow-sm focus:border-none outline-none focus:ring-2 ring-green-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-300">Stock</label>
                                <input
                                    type="number"
                                    id="edit-stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full h-8 rounded-md bg-emerald-800 border-emerald-100 text-white shadow-sm focus:border-none outline-none focus:ring-2 ring-green-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="edit-image_url" className="block text-sm font-medium text-gray-300">Image URL</label>
                                <input
                                    type="text"
                                    id="edit-image_url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full h-8 rounded-md bg-emerald-800 border-emerald-100 text-white shadow-sm focus:border-none outline-none focus:ring-2 ring-green-700"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-900 text-white rounded-md hover:bg-emerald-700"
                            >
                                Update Product
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Delete Product Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Product"
            >
                {currentProduct && (
                    <div>
                        <p className="text-gray-300 mb-4">
                            Are you sure you want to delete <span className="font-semibold">{currentProduct.name}</span>? This action cannot be undone.
                        </p>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProduct}
                                className="px-4 py-2 bg-red-900 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};
export default ProductsTable;
