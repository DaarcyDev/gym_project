import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ConsiderationsComponent } from './considerations.component';
import { AuthService } from 'app/core/auth/auth.service';

export default [
	{
		path: '',
		component: ConsiderationsComponent,
		resolve: {
			data: () => inject(AuthService).getData(),
		},
	},
] as Routes;