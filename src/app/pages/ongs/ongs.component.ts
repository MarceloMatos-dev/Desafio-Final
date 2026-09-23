import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-ongs',
  imports: [RouterLink],
  templateUrl: './ongs.component.html',
  styleUrl: './ongs.component.css'
})
export class OngsComponent {
  constructor(public data: DataService) {}
  get ongs() { return this.data.centers(); }
}
