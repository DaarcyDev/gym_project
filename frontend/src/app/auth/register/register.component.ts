// import { UsersService } from './../../services/users.service';
import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  message: string = '';

  constructor(private UsersService: UsersService) { }

  ngOnInit() {
    this.UsersService.register().subscribe({
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
