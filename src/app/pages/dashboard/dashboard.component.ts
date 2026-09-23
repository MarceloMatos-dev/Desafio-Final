import { Component } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Center, Donation, ResourceGoal, SupplyKey } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  centers: Center[] = [];
  donations: Donation[] = [];

  readonly supplyKeys: { key: SupplyKey; label: string }[] = [
    { key: 'water', label: 'Água' },
    { key: 'food', label: 'Alimentos' },
    { key: 'hygiene', label: 'Higiene' },
    { key: 'medicine', label: 'Medicamentos' },
    { key: 'clothes', label: 'Roupas' }
  ];

  constructor(public data: DataService) { this.reload(); }

  reload(): void {
    this.centers = this.data.centers();
    this.donations = this.data.donations();
  }

  avg(center: Center): number {
    const percentages = this.supplyKeys.map(item => this.data.percentage(center[item.key]));
    return Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length);
  }

  status(value: number): string {
    return value <= 25 ? '🔴 Crítico' : value <= 50 ? '🟠 Urgente' : value <= 75 ? '🟡 Atenção' : '🟢 Estável';
  }

  get average(): number {
    if (!this.centers.length) return 0;
    return Math.round(this.centers.reduce((sum, center) => sum + this.avg(center), 0) / this.centers.length);
  }

  get critical(): number { return this.centers.filter(center => this.avg(center) <= 50).length; }
  get pending(): Donation[] { return this.donations.filter(donation => donation.status === 'pending'); }

  confirm(id: number): void { this.data.confirmDonation(id); this.reload(); }
  reject(id: number): void { this.data.rejectDonation(id); this.reload(); }
}
