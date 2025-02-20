import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AttendanceComponent } from './attendance/attendance.component';
import { MembershipsComponent } from './memberships/memberships.component';
import { SalesComponent } from './sales/sales.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AttendanceComponent,
    MembershipsComponent,
    SalesComponent
  ]
})
export class DashboardModule { }
