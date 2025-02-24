import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { AuthService } from 'app/core/auth/auth.service';

export default [
	{
		path: '',
		component: ProfileComponent,
		resolve: {
			data: () => inject(AuthService).getData(),
		},
	},
] as Routes;