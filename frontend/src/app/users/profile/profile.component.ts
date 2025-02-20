import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  message: string = '';

  constructor(private UsersService: UsersService) { }

  ngOnInit() {
    this.UsersService.profile().subscribe({
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