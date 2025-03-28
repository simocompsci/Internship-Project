# React Admin Dashboard with Laravel Backend

This project is a full-stack admin dashboard application with a React frontend and Laravel backend.

## Project Structure

The project consists of two main parts:

1. **Frontend (React Admin Dashboard)**
   - Located in the `dashboard-frontend` directory
   - Built with React, React Router, and styled with Tailwind CSS
   - Uses framer-motion for animations
   - Uses Recharts for data visualization
   - Uses Axios for API communication

2. **Backend (Laravel API)**
   - Located in the `dashboard-backend` directory
   - Built with Laravel PHP framework
   - Provides RESTful API endpoints for the frontend
   - Includes database migrations and seeders for sample data

## Setup Instructions

### Backend (Laravel)

1. Navigate to the backend directory:
   ```
   cd dashboard-backend
   ```

2. Install dependencies:
   ```
   composer install
   ```

   ```

3. Configure the database in `.env` file.

4. Run migrations and seed the database:
   ```
   php artisan migrate:fresh --seed
   ```

5. Start the development server:
   ```
   php artisan serve
   ```

### Frontend (React)

1. Navigate to the frontend directory:
   ```
   cd dashboard-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```


## CORS CONFIGURATION
To enable CORS for the Laravel backend, you need to configure them in the 
`Config\cors.php` file.

To do that , go ahead and copy this code to your file:
     
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

**IMPORTANT NOTE:** In the `allowed_origins` array, you should change the port number `5173` to the port that your frontend is running on if it's different from the default port.

