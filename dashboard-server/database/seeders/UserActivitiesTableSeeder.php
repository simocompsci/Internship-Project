<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserActivity;
use App\Models\Product;
use Carbon\Carbon;

class UserActivitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();
        
        $activityTypes = ['login', 'product_view', 'add_to_cart', 'checkout_initiated', 'purchase', 'profile_update'];
        
        // Generate activities for the past 30 days
        for ($i = 0; $i < 500; $i++) {
            $user = $users->random();
            $activityType = $activityTypes[array_rand($activityTypes)];
            $activityDate = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
            
            $metadata = null;
            $description = null;
            
            switch ($activityType) {
                case 'login':
                    $description = 'User logged in';
                    $metadata = json_encode([
                        'ip' => '192.168.' . rand(0, 255) . '.' . rand(0, 255),
                        'device' => ['desktop', 'mobile', 'tablet'][array_rand(['desktop', 'mobile', 'tablet'])],
                    ]);
                    break;
                    
                case 'product_view':
                    $product = $products->random();
                    $description = "Viewed product: {$product->name}";
                    $metadata = json_encode([
                        'product_id' => $product->id,
                        'category' => $product->category,
                    ]);
                    break;
                    
                case 'add_to_cart':
                    $product = $products->random();
                    $description = "Added to cart: {$product->name}";
                    $metadata = json_encode([
                        'product_id' => $product->id,
                        'quantity' => rand(1, 5),
                    ]);
                    break;
                    
                case 'checkout_initiated':
                    $description = 'Started checkout process';
                    $metadata = json_encode([
                        'cart_value' => rand(50, 500) + (rand(0, 99) / 100),
                        'items_count' => rand(1, 10),
                    ]);
                    break;
                    
                case 'purchase':
                    $description = 'Completed purchase';
                    $metadata = json_encode([
                        'order_id' => rand(1000, 9999),
                        'amount' => rand(50, 500) + (rand(0, 99) / 100),
                    ]);
                    break;
                    
                case 'profile_update':
                    $description = 'Updated profile information';
                    $fieldsOptions = ['name', 'email', 'password'];
                    $numFields = rand(1, 3);
                    $selectedFields = array_rand(array_flip($fieldsOptions), $numFields);
                    if (!is_array($selectedFields)) {
                        $selectedFields = [$selectedFields];
                    }
                    $metadata = json_encode([
                        'fields_updated' => $selectedFields,
                    ]);
                    break;
            }
            
            UserActivity::create([
                'user_id' => $user->id,
                'activity_type' => $activityType,
                'description' => $description,
                'metadata' => $metadata,
                'created_at' => $activityDate,
                'updated_at' => $activityDate,
            ]);
        }
    }
}
