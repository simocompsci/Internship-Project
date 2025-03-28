<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\ProductsTableSeeder;
use Database\Seeders\OrdersTableSeeder;
use Database\Seeders\UserActivitiesTableSeeder;
use Database\Seeders\UsersTableSeeder;
use Database\Seeders\SalesTableSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UsersTableSeeder::class,
            ProductsTableSeeder::class,
            OrdersTableSeeder::class,
            UserActivitiesTableSeeder::class,
            SalesTableSeeder::class,
        ]);
    }
}
