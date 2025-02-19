import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-memberships',
  imports: [],
  templateUrl: './memberships.component.html',
  styleUrl: './memberships.component.scss'
})
export class MembershipsComponent {
  message: string = '';

  constructor(private UsersService: UsersService) { }

  ngOnInit() {
    this.UsersService.membership().subscribe({
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