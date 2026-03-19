import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login'
	},
	{
		path: 'login',
		loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage)
	},
	{
		path: 'signup',
		loadComponent: () => import('./features/auth/signup.page').then((m) => m.SignupPage)
	},
	{
		path: 'employees',
		canActivate: [authGuard],
		loadComponent: () => import('./features/employees/employees-list.page').then((m) => m.EmployeesListPage)
	},
	{
		path: 'employees/new',
		canActivate: [authGuard],
		loadComponent: () => import('./features/employees/employee-create.page').then((m) => m.EmployeeCreatePage)
	},
	{
		path: 'employees/:id',
		canActivate: [authGuard],
		loadComponent: () => import('./features/employees/employee-details.page').then((m) => m.EmployeeDetailsPage)
	},
	{
		path: 'employees/:id/edit',
		canActivate: [authGuard],
		loadComponent: () => import('./features/employees/employee-edit.page').then((m) => m.EmployeeEditPage)
	},
	{
		path: '**',
		redirectTo: 'login'
	}
];
