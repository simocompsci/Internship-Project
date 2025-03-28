<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Wireless Earbuds',
                'description' => 'High-quality wireless earbuds with noise cancellation',
                'price' => 59.99,
                'stock' => 143,
                'category' => 'Electronics',
                'image_url' => 'https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Leather Wallet',
                'description' => 'Genuine leather wallet with multiple card slots',
                'price' => 39.99,
                'stock' => 89,
                'category' => 'Accessories',
                'image_url' => 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Smart Watch',
                'description' => 'Advanced smartwatch with health tracking features',
                'price' => 199.99,
                'stock' => 56,
                'category' => 'Electronics',
                'image_url' => 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Yoga Mat',
                'description' => 'Non-slip yoga mat for comfortable workouts',
                'price' => 29.99,
                'stock' => 210,
                'category' => 'Fitness',
                'image_url' => 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Coffee Maker',
                'description' => 'Programmable coffee maker with thermal carafe',
                'price' => 79.99,
                'stock' => 78,
                'category' => 'Home',
                'image_url' => 'https://images.unsplash.com/photo-1570087635000-f46f1b88bc15?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'is_featured' => false,
                'is_active' => true,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
