import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
@Component({
  selector: 'app-attendance',
  imports: [],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  message: string = '';

  constructor(private DashboardService: DashboardService) { }

  ngOnInit() {
    this.DashboardService.dashboard_attendance().subscribe({
      next: (response) => {
        this.message = response.message;
      },
      error: (error) => {
        console.log(` Error al obtener el mensaje ${error}`);
        // this.message = error.message;
      }
    });
  }
}