<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Get dashboard overview statistics.
     */
    public function getDashboardStats()
    {
        // User stats
        $totalUsers = User::count();
        $newUsersToday = User::whereDate('created_at', today())->count();
        
        // Order stats
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        
        // Revenue stats
        $totalRevenue = Order::where('status', 'completed')->sum('total_amount');
        $revenueToday = Order::where('status', 'completed')
            ->whereDate('created_at', today())
            ->sum('total_amount');
            
        // Product stats
        $totalProducts = Product::count();
        $outOfStockProducts = Product::where('stock', 0)->count();

        return response()->json([
            'userStats' => [
                'totalUsers' => $totalUsers,
                'newUsersToday' => $newUsersToday,
            ],
            'orderStats' => [
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
            ],
            'revenueStats' => [
                'totalRevenue' => round($totalRevenue, 2),
                'revenueToday' => round($revenueToday, 2),
            ],
            'productStats' => [
                'totalProducts' => $totalProducts,
                'outOfStockProducts' => $outOfStockProducts,
            ],
        ]);
    }

    /**
     * Get sales vs targets data.
     */
    public function getSalesVsTargets()
    {
        // For demonstration, we'll set some arbitrary targets
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $targets = [
            10000, 12000, 15000, 18000, 20000, 22000, 
            25000, 23000, 21000, 20000, 22000, 25000
        ];
        
        $currentYear = now()->year;
        
        $monthlySales = Sale::select(
            DB::raw('MONTH(date) as month'),
            DB::raw('SUM(total_revenue) as revenue')
        )
            ->whereYear('date', $currentYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');
            
        $result = [];
        
        for ($i = 1; $i <= 12; $i++) {
            $result[] = [
                'month' => $months[$i-1],
                'target' => $targets[$i-1],
                'actual' => isset($monthlySales[$i]) ? round($monthlySales[$i]->revenue, 2) : 0,
            ];
        }
        
        return response()->json($result);
    }

    /**
     * Get traffic sources data.
     */
    public function getTrafficSources()
    {
        // For demonstration, we'll return some sample data
        // In a real app, this would come from user activities with source tracking
        return response()->json([
            ['source' => 'Direct', 'count' => 4200],
            ['source' => 'Organic Search', 'count' => 3800],
            ['source' => 'Referral', 'count' => 2200],
            ['source' => 'Social Media', 'count' => 1800],
            ['source' => 'Email', 'count' => 1200],
            ['source' => 'Paid Search', 'count' => 900],
        ]);
    }
}
