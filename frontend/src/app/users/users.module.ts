import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { MembershipsComponent } from './memberships/memberships.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MembershipsComponent,
    ProfileComponent
  ]
})
export class UsersModule { }
