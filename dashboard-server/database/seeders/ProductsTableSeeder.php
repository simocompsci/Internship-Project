<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports & Outdoors'];
        
        $products = [
            // Electronics
            [
                'name' => 'Smartphone X',
                'description' => 'Latest smartphone with advanced features',
                'price' => 999.99,
                'stock' => 50,
                'category' => 'Electronics',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Laptop Pro',
                'description' => 'High-performance laptop for professionals',
                'price' => 1499.99,
                'stock' => 25,
                'category' => 'Electronics',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Wireless Earbuds',
                'description' => 'Premium sound quality with noise cancellation',
                'price' => 149.99,
                'stock' => 100,
                'category' => 'Electronics',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Smart Watch',
                'description' => 'Track your fitness and stay connected',
                'price' => 249.99,
                'stock' => 75,
                'category' => 'Electronics',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Tablet Ultra',
                'description' => 'Portable and powerful tablet',
                'price' => 699.99,
                'stock' => 30,
                'category' => 'Electronics',
                'is_featured' => false,
                'is_active' => true,
            ],
            
            // Clothing
            [
                'name' => 'Men\'s Casual Shirt',
                'description' => 'Comfortable and stylish casual shirt',
                'price' => 39.99,
                'stock' => 200,
                'category' => 'Clothing',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Women\'s Dress',
                'description' => 'Elegant dress for special occasions',
                'price' => 79.99,
                'stock' => 150,
                'category' => 'Clothing',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Running Shoes',
                'description' => 'Lightweight and comfortable running shoes',
                'price' => 89.99,
                'stock' => 100,
                'category' => 'Clothing',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Winter Jacket',
                'description' => 'Warm and waterproof winter jacket',
                'price' => 129.99,
                'stock' => 80,
                'category' => 'Clothing',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Jeans',
                'description' => 'Classic fit jeans',
                'price' => 59.99,
                'stock' => 250,
                'category' => 'Clothing',
                'is_featured' => false,
                'is_active' => true,
            ],
            
            // Home & Kitchen
            [
                'name' => 'Coffee Maker',
                'description' => 'Programmable coffee maker with timer',
                'price' => 79.99,
                'stock' => 60,
                'category' => 'Home & Kitchen',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Blender',
                'description' => 'High-speed blender for smoothies and more',
                'price' => 69.99,
                'stock' => 45,
                'category' => 'Home & Kitchen',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Cookware Set',
                'description' => 'Complete set of non-stick cookware',
                'price' => 199.99,
                'stock' => 30,
                'category' => 'Home & Kitchen',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Bedding Set',
                'description' => 'Luxury bedding set with duvet cover and pillowcases',
                'price' => 149.99,
                'stock' => 40,
                'category' => 'Home & Kitchen',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Smart Thermostat',
                'description' => 'Energy-saving smart thermostat',
                'price' => 129.99,
                'stock' => 25,
                'category' => 'Home & Kitchen',
                'is_featured' => false,
                'is_active' => true,
            ],
            
            // Books
            [
                'name' => 'Bestselling Novel',
                'description' => 'Award-winning fiction novel',
                'price' => 24.99,
                'stock' => 300,
                'category' => 'Books',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Cookbook',
                'description' => 'Collection of gourmet recipes',
                'price' => 34.99,
                'stock' => 150,
                'category' => 'Books',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Self-Help Book',
                'description' => 'Guide to personal development',
                'price' => 19.99,
                'stock' => 200,
                'category' => 'Books',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'History Book',
                'description' => 'Comprehensive history of the 20th century',
                'price' => 29.99,
                'stock' => 100,
                'category' => 'Books',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Children\'s Book',
                'description' => 'Illustrated book for young readers',
                'price' => 14.99,
                'stock' => 250,
                'category' => 'Books',
                'is_featured' => false,
                'is_active' => true,
            ],
            
            // Sports & Outdoors
            [
                'name' => 'Yoga Mat',
                'description' => 'Non-slip yoga mat for exercise',
                'price' => 29.99,
                'stock' => 120,
                'category' => 'Sports & Outdoors',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Dumbbells Set',
                'description' => 'Adjustable dumbbells for home workouts',
                'price' => 149.99,
                'stock' => 50,
                'category' => 'Sports & Outdoors',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Tennis Racket',
                'description' => 'Professional tennis racket',
                'price' => 89.99,
                'stock' => 40,
                'category' => 'Sports & Outdoors',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Camping Tent',
                'description' => 'Waterproof tent for 4 people',
                'price' => 199.99,
                'stock' => 30,
                'category' => 'Sports & Outdoors',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Hiking Backpack',
                'description' => 'Durable backpack for outdoor adventures',
                'price' => 79.99,
                'stock' => 60,
                'category' => 'Sports & Outdoors',
                'is_featured' => false,
                'is_active' => true,
            ],
        ];
        
        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
