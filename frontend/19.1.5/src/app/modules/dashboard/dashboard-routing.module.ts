import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './attendance/attendance.component';
import { MembershipsComponent } from './memberships/memberships.component';
import { SalesComponent } from './sales/sales.component';


const routes: Routes = [
  {
    path: 'attendance',
    component: AttendanceComponent
  },
  {
    path: 'memberships',
    component: MembershipsComponent
  },
  {
    path: 'sales',
    component: SalesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
