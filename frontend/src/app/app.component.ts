import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service'
@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  message: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getTestMessage().subscribe(response => {
      this.message = response.message;
    });
  }
}
