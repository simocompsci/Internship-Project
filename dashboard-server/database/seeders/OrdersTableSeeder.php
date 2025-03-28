<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;

class OrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'customer')->get();
        $products = Product::all();
        
        $paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'];
        $statuses = ['pending', 'processing', 'completed', 'cancelled'];
        
        // Generate orders for the past 30 days
        for ($i = 0; $i < 100; $i++) {
            $user = $users->random();
            $orderDate = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
            
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => 0, // Will calculate based on items
                'status' => $statuses[array_rand($statuses)],
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'shipping_address' => '123 Main St, City, State, 12345',
                'billing_address' => '123 Main St, City, State, 12345',
                'tracking_number' => 'TRK' . rand(100000, 999999),
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);
            
            // Add 1-5 items to the order
            $numItems = rand(1, 5);
            $totalAmount = 0;
            
            $orderProducts = $products->random($numItems);
            
            foreach ($orderProducts as $product) {
                $quantity = rand(1, 3);
                $price = $product->price;
                $itemTotal = $price * $quantity;
                $totalAmount += $itemTotal;
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);
            }
            
            // Update the order with the calculated total
            $order->update([
                'total_amount' => $totalAmount
            ]);
        }
    }
}
