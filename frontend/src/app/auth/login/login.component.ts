import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  message: string = '';

  constructor(private UsersService: UsersService) { }

  ngOnInit() {
    this.UsersService.login().subscribe({
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
