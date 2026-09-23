import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { Center, ResourceGoal, SupplyKey } from '../../models/models';

@Component({
  selector: 'app-doar',
  imports: [FormsModule, RouterLink],
  templateUrl: './doar.component.html',
  styleUrl: './doar.component.css'
})
export class DoarComponent {
  center?: Center;
  supply: SupplyKey = 'water';
  quantity = 1;
  success = false;
  projectedPercentage = 0;

  supplies = [
    { key: 'water' as SupplyKey, label: 'Água' },
    { key: 'food' as SupplyKey, label: 'Alimentos' },
    { key: 'hygiene' as SupplyKey, label: 'Higiene' },
    { key: 'medicine' as SupplyKey, label: 'Medicamentos' },
    { key: 'clothes' as SupplyKey, label: 'Roupas' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public data: DataService,
    public auth: AuthService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.center = this.data.centers().find(center => center.id === id);
    if (!this.center || !this.auth.isUser()) this.router.navigateByUrl('/pontos-apoio');
  }

  resource(key: SupplyKey): ResourceGoal {
    return this.center?.[key] ?? { current: 0, goal: 1 };
  }

  projected(key: SupplyKey): number {
    const resource = this.resource(key);
    const extra = key === this.supply ? Number(this.quantity || 0) : 0;
    return Math.min(100, Math.round(((resource.current + extra) / resource.goal) * 100));
  }

  maxDonation(): number {
    return this.data.remaining(this.resource(this.supply));
  }

  submit(): void {
    const user = this.auth.current();
    if (!user || !this.center || this.quantity < 1) return;
    this.quantity = Math.min(Number(this.quantity), this.maxDonation());
    if (this.quantity < 1) return;

    const selected = this.supplies.find(item => item.key === this.supply)!;
    this.projectedPercentage = this.projected(this.supply);
    this.data.createDonation({
      userId: user.id,
      donorName: user.name,
      centerId: this.center.id,
      centerName: this.center.name,
      supply: this.supply,
      supplyLabel: selected.label,
      quantity: Number(this.quantity)
    });
    this.success = true;
  }
}
