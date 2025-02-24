import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { ConcesDetailComponent } from './conces-detail.component';

export default [
    {
        path: '',
        component: ConcesDetailComponent,
        resolve: {
            data: () => inject(AuthService).getData(),
        },
    },
] as Routes;