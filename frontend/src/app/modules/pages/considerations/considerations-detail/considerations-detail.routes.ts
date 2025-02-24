import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { ConsiderationsDetailComponent } from './considerations-detail.component';

export default [
	{
		path: '',
		component: ConsiderationsDetailComponent,
		resolve: {
			data: () => inject(AuthService).getData(),
		},
	},
] as Routes;