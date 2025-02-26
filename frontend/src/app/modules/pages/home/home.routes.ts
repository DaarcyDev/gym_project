import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { HomeComponent } from 'app/modules/pages/home/home.component';
import { AuthService } from 'app/core/auth/auth.service';

export default [
	{
		path: '',
		component: HomeComponent,
		resolve: {
			data: () => inject(AuthService).getData(),
		},
	},
] as Routes;