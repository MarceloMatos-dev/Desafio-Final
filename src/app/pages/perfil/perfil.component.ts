import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { Center, Donation, SupplyKey } from '../../models/models';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  goalMessage = '';
  goals: Record<SupplyKey, number> = {
    water: 500,
    food: 600,
    hygiene: 300,
    medicine: 200,
    clothes: 400
  };

  constructor(public auth: AuthService, private data: DataService) {
    const center = this.ongCenter;
    if (center && this.hasGoals(center)) {
      this.goals = {
        water: center.water.goal,
        food: center.food.goal,
        hygiene: center.hygiene.goal,
        medicine: center.medicine.goal,
        clothes: center.clothes.goal
      };
    }
  }

  get myDonations(): Donation[] {
    const user = this.auth.current();
    return user ? this.data.donations().filter(donation => donation.userId === user.id) : [];
  }

  get ongCenter(): Center | undefined {
    const user = this.auth.current();
    if (!user?.centerId) return undefined;
    return this.data.centers().find(center => center.id === user.centerId);
  }

  hasGoals(center: Center): boolean {
    return [center.water, center.food, center.hygiene, center.medicine, center.clothes]
      .every(resource => resource.goal > 0);
  }

  saveGoals(): void {
    const center = this.ongCenter;
    if (!center) return;

    const valid = Object.values(this.goals).every(goal => Number.isFinite(goal) && goal > 0);
    if (!valid) {
      this.goalMessage = 'Informe uma meta maior que zero para todas as categorias.';
      return;
    }

    const saved = this.data.updateOngGoals(center.id, this.goals);
    this.goalMessage = saved ? 'Metas salvas com sucesso!' : 'Não foi possível salvar as metas.';
  }

  formatCnpj(cnpj?: string): string {
    if (!cnpj) return 'Não informado';
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  statusLabel(status: Donation['status']): string {
    return status === 'pending'
      ? '🟡 Aguardando recebimento'
      : status === 'received'
        ? '🟢 Recebida'
        : '🔴 Recusada';
  }
}
