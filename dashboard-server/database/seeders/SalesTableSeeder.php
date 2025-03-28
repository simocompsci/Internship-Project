<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SalesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get dates with completed orders
        $dates = Order::where('status', 'completed')
            ->select(DB::raw('DATE(created_at) as date'))
            ->distinct()
            ->pluck('date');

        foreach ($dates as $date) {
            $ordersForDay = Order::where('status', 'completed')
                ->whereDate('created_at', $date)
                ->get();
            
            $totalRevenue = $ordersForDay->sum('total_amount');
            $ordersCount = $ordersForDay->count();
            $averageOrderValue = $ordersCount > 0 ? $totalRevenue / $ordersCount : 0;

            Sale::create([
                'date' => $date,
                'total_revenue' => $totalRevenue,
                'orders_count' => $ordersCount,
                'average_order_value' => $averageOrderValue,
            ]);
        }
        
        // Generate some historical data for the past year
        $startDate = Carbon::now()->subYear()->startOfMonth();
        $endDate = Carbon::now()->subMonth()->endOfMonth();
        
        $currentDate = $startDate->copy();
        
        while ($currentDate->lte($endDate)) {
            // Skip if we already have data for this date
            $existingSale = Sale::whereDate('date', $currentDate->toDateString())->first();
            
            if (!$existingSale) {
                // Generate random data
                $ordersCount = rand(5, 50);
                $averageOrderValue = rand(50, 200) + (rand(0, 99) / 100);
                $totalRevenue = $ordersCount * $averageOrderValue;
                
                Sale::create([
                    'date' => $currentDate->toDateString(),
                    'total_revenue' => $totalRevenue,
                    'orders_count' => $ordersCount,
                    'average_order_value' => $averageOrderValue,
                ]);
            }
            
            $currentDate->addDay();
        }
    }
}
