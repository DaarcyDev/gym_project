import { Component } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
@Component({
  selector: 'app-checkin',
  imports: [],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss'
})
export class CheckinComponent {
  message: string = '';

  constructor(private AttendanceService: AttendanceService) { }

  ngOnInit() {
    this.AttendanceService.checkin().subscribe({
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