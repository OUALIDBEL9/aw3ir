import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css']
})
export class MeteoComponent {

  city = { name: '' };
  cityList: string[] = [];

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.city.name.trim()) return;

    this.cityList.push(this.city.name);

    this.router.navigate(['/meteo', this.city.name]);

    this.city = { name: '' };
  }
}
