import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-memberships',
  imports: [],
  templateUrl: './memberships.component.html',
  styleUrl: './memberships.component.scss'
})
export class MembershipsComponent {
  message: string = '';

  constructor(private DashboardService: DashboardService) { }

  ngOnInit() {
    this.DashboardService.dashboard_membership().subscribe({
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