import { Component } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
@Component({
  selector: 'app-history',
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  message: string = '';

  constructor(private AttendanceService: AttendanceService) { }

  ngOnInit() {
    this.AttendanceService.history().subscribe({
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