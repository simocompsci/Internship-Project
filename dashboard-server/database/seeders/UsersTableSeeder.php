<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'demographics' => json_encode([
                'age_group' => '30-40',
                'gender' => 'male',
                'location' => 'New York'
            ])
        ]);

        // Create moderator user
        User::create([
            'name' => 'Moderator User',
            'email' => 'moderator@example.com',
            'password' => Hash::make('password'),
            'role' => 'moderator',
            'status' => 'active',
            'demographics' => json_encode([
                'age_group' => '25-35',
                'gender' => 'female',
                'location' => 'San Francisco'
            ])
        ]);

        // Create sample customers
        $roles = ['customer'];
        $statuses = ['active', 'inactive'];
        $genders = ['male', 'female', 'other'];
        $ageGroups = ['18-24', '25-35', '36-45', '46-55', '56+'];
        $locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];

        for ($i = 1; $i <= 50; $i++) {
            User::create([
                'name' => "Customer $i",
                'email' => "customer$i@example.com",
                'password' => Hash::make('password'),
                'role' => $roles[0],
                'status' => $statuses[array_rand($statuses)],
                'demographics' => json_encode([
                    'age_group' => $ageGroups[array_rand($ageGroups)],
                    'gender' => $genders[array_rand($genders)],
                    'location' => $locations[array_rand($locations)]
                ])
            ]);
        }
    }
}
