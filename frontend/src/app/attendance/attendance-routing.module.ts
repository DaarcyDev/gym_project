import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './checkin/checkin.component';
import { HistoryComponent } from './history/history.component';


const routes: Routes = [
  {
    path: 'checkin',
    component: CheckinComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
