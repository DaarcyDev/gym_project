import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipsComponent } from './memberships/memberships.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: 'memberships',
    component: MembershipsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
