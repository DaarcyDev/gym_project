import { Routes } from '@angular/router';

export const routes: Routes = [
	// Redirect to the dashboard
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },

	// Auth routes
	{
		path: 'auth',
		loadChildren: () =>
			import('./auth/auth.module').then((m) => m.AuthModule),
	},

	// Dashboard routes
	{
		path: 'dashboard',
		loadChildren: () =>
			import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
	},

	// Attendance routes
	{
		path: 'attendance',
		loadChildren: () =>
			import('./attendance/attendance.module').then((m) => m.AttendanceModule),
	},

	// Products routes
	{
		path: 'products',
		loadChildren: () =>
			import('./products/products.module').then((m) => m.ProductsModule),
	},

	// Users routes
	{
		path: 'users',
		loadChildren: () =>
			import('./users/users.module').then((m) => m.UsersModule),
	},

	// Error routes
	{
		path: '**',
		redirectTo: 'dashboard',
	}
];
