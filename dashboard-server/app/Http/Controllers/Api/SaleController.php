<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SaleController extends Controller
{
    /**
     * Display a listing of the sales.
     */
    public function index()
    {
        $sales = Sale::orderBy('date', 'desc')->get();

        return response()->json([
            'sales' => $sales
        ]);
    }

    /**
     * Store a newly created sale in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'total_revenue' => 'required|numeric|min:0',
            'orders_count' => 'required|integer|min:0',
            'average_order_value' => 'required|numeric|min:0',
        ]);

        $sale = Sale::create($validated);

        return response()->json([
            'message' => 'Sale record created successfully',
            'sale' => $sale
        ], 201);
    }

    /**
     * Display the specified sale.
     */
    public function show(Sale $sale)
    {
        return response()->json([
            'sale' => $sale
        ]);
    }

    /**
     * Update the specified sale in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'date' => 'sometimes|date',
            'total_revenue' => 'sometimes|numeric|min:0',
            'orders_count' => 'sometimes|integer|min:0',
            'average_order_value' => 'sometimes|numeric|min:0',
        ]);

        $sale->update($validated);

        return response()->json([
            'message' => 'Sale record updated successfully',
            'sale' => $sale
        ]);
    }

    /**
     * Remove the specified sale from storage.
     */
    public function destroy(Sale $sale)
    {
        $sale->delete();

        return response()->json([
            'message' => 'Sale record deleted successfully'
        ]);
    }

    /**
     * Get sales statistics.
     */
    public function getStats()
    {
        $totalRevenue = Sale::sum('total_revenue');
        $totalOrders = Sale::sum('orders_count');

        // Calculate growth rates
        $currentMonthRevenue = Sale::whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('total_revenue');

        $lastMonthRevenue = Sale::whereMonth('date', now()->subMonth()->month)
            ->whereYear('date', now()->subMonth()->year)
            ->sum('total_revenue');

        $revenueGrowth = $lastMonthRevenue > 0
            ? round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;

        $averageOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        return response()->json([
            'totalRevenue' => round($totalRevenue, 2),
            'totalOrders' => $totalOrders,
            'revenueGrowth' => $revenueGrowth,
            'averageOrderValue' => $averageOrderValue
        ]);
    }

    

    /**
     * Get sales by category.
     */
    public function getSalesByCategory()
    {
        $salesByCategory = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->select(
                'products.category',
                DB::raw('SUM(order_items.quantity * order_items.price) as revenue')
            )
            ->groupBy('products.category')
            ->orderBy('revenue', 'desc')
            ->get();

        return response()->json($salesByCategory);
    }


    public function getMonthlySales()
    {
        // Get sales data grouped by month
        $monthlySales = Sale::select(
            DB::raw('MONTHNAME(date) as name'),
            DB::raw('SUM(total_revenue) as sales')
        )
            ->groupBy('name')
            ->orderByRaw('MONTH(date)')
            ->get();

        // If no data is found, generate sample data
        if ($monthlySales->isEmpty()) {
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $monthlySales = collect($months)->map(function ($month) {
                return [
                    'name' => $month,
                    'sales' => rand(3500, 8000)
                ];
            });
        }

        return response()->json($monthlySales);
    }

    public function getDailySales()
    {
        // Get sales data grouped by day
        $dailySales = Sale::select(
            DB::raw('DATE_FORMAT(date, "%Y-%m-%d") as date'),
            DB::raw('DATE_FORMAT(date, "%d %b") as name'),
            DB::raw('SUM(total_revenue) as sales')
        )
            ->groupBy('date', 'name')
            ->orderBy('date')
            ->limit(30) // Limit to last 30 days
            ->get();

            
        // If no data is found, generate sample data
        if ($dailySales->isEmpty()) {
            $dailySales = collect(range(1, 30))->map(function ($day) {
                $date = Carbon::now()->subDays(30 - $day);
                return [
                    'date' => $date->format('Y-m-d'),
                    'name' => $date->format('d M'),
                    'sales' => rand(500, 2000)
                ];
            });
        }

        return response()->json($dailySales);
    }


    /**
     * Generate daily sales data from orders.
     */
    
    
}
