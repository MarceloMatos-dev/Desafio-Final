import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { Center, ResourceGoal, SupplyKey } from '../../models/models';

@Component({
  selector: 'app-pontos',
  templateUrl: './pontos-apoio.component.html',
  styleUrl: './pontos-apoio.component.css'
})
export class PontosApoioComponent {
  centers: Center[];

  constructor(public data: DataService, public auth: AuthService, private router: Router) {
    this.centers = data.centers();
  }

  supplies(center: Center): { key: SupplyKey; name: string; resource: ResourceGoal }[] {
    return [
      { key: 'water', name: 'Água', resource: center.water },
      { key: 'food', name: 'Alimentos', resource: center.food },
      { key: 'hygiene', name: 'Higiene', resource: center.hygiene },
      { key: 'medicine', name: 'Medicamentos', resource: center.medicine },
      { key: 'clothes', name: 'Roupas', resource: center.clothes }
    ];
  }

  donate(center: Center): void {
    if (!this.auth.current()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/doar/${center.id}` } });
      return;
    }
    if (!this.auth.isUser()) return;
    this.router.navigate(['/doar', center.id]);
  }
}
