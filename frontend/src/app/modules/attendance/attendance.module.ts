import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { HistoryComponent } from './history/history.component';
import { CheckinComponent } from './checkin/checkin.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    HistoryComponent,
    CheckinComponent
  ]
})
export class AttendanceModule { }
