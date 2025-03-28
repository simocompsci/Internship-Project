<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::latest()->get();
        
        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,moderator,customer',
            'status' => 'required|string|in:active,inactive',
            'avatar_url' => 'nullable|string',
            'demographics' => 'nullable|json',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        return response()->json([
            'user' => $user
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|string|in:admin,moderator,customer',
            'status' => 'sometimes|string|in:active,inactive',
            'avatar_url' => 'nullable|string',
            'demographics' => 'nullable|json',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Get user statistics.
     */
    public function getStats()
    {
        $totalUsers = User::count();
        $newUsersToday = User::whereDate('created_at', today())->count();
        $activeUsers = User::where('status', 'active')->count();
        
        // Calculate churn rate (simplified)
        $usersLastMonth = User::whereDate('created_at', '<=', now()->subMonth())->count();
        $churnedUsers = User::where('status', 'inactive')
            ->whereDate('updated_at', '>=', now()->subMonth())
            ->count();
        
        $churnRate = $usersLastMonth > 0 ? round(($churnedUsers / $usersLastMonth) * 100, 1) . '%' : '0%';

        return response()->json([
            'totalUsers' => $totalUsers,
            'newUsersToday' => $newUsersToday,
            'activeUsers' => $activeUsers,
            'churnRate' => $churnRate
        ]);
    }

}
