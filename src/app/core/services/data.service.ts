import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Center, Donation, Post, ResourceGoal, SupplyKey } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly centersKey = 'rf_centers_salvador_v3';
  private readonly postsKey = 'rf_posts_salvador';
  private readonly donationsKey = 'rf_donations_salvador_v3';

  readonly defaultCenters: Center[] = [
    this.center(1, 'Salvador Solidário', 'Liberdade, Salvador - BA', 'Apoio a famílias e campanhas emergenciais.', 'Cestas básicas',
      [320, 500], [180, 600], [120, 300], [90, 200], [350, 500]),
    this.center(2, 'Instituto Bahia Acolhe', 'Itapuã, Salvador - BA', 'Distribuição de alimentos, água e higiene.', 'Água mineral',
      [380, 700], [410, 650], [190, 400], [130, 250], [420, 500]),
    this.center(3, 'Rede Cajazeiras Solidária', 'Cajazeiras, Salvador - BA', 'Mobilização comunitária e acolhimento temporário.', 'Medicamentos e higiene',
      [520, 650], [440, 650], [220, 400], [85, 250], [390, 500]),
    this.center(4, 'Subúrbio em Rede', 'Subúrbio Ferroviário, Salvador - BA', 'Ajuda humanitária e apoio comunitário.', 'Alimentos não perecíveis',
      [270, 600], [210, 700], [110, 350], [120, 250], [330, 500])
  ];

  constructor(private storage: StorageService) {
    if (!this.storage.get<Center[]>(this.centersKey, []).length) {
      this.storage.set(this.centersKey, this.defaultCenters);
    }
  }

  private center(id: number, name: string, location: string, description: string, need: string,
    water: [number, number], food: [number, number], hygiene: [number, number], medicine: [number, number], clothes: [number, number]): Center {
    const goal = ([current, target]: [number, number]): ResourceGoal => ({ current, goal: target });
    return { id, name, location, description, verified: true, need, water: goal(water), food: goal(food), hygiene: goal(hygiene), medicine: goal(medicine), clothes: goal(clothes) };
  }

  centers(): Center[] { return this.storage.get<Center[]>(this.centersKey, this.defaultCenters); }
  saveCenters(centers: Center[]): void { this.storage.set(this.centersKey, centers); }
  donations(): Donation[] { return this.storage.get<Donation[]>(this.donationsKey, []); }
  saveDonations(donations: Donation[]): void { this.storage.set(this.donationsKey, donations); }

  percentage(resource: ResourceGoal): number {
    if (!resource.goal) return 0;
    return Math.min(100, Math.round((resource.current / resource.goal) * 100));
  }

  remaining(resource: ResourceGoal): number {
    return Math.max(0, resource.goal - resource.current);
  }

  createOngCenter(ownerUserId: number, name: string, neighborhood: string, description: string): Center {
    const centers = this.centers();
    const center: Center = {
      id: Date.now(),
      name,
      location: `${neighborhood}, Salvador - BA`,
      description,
      ownerUserId,
      verified: false,
      need: 'Metas ainda não definidas',
      water: { current: 0, goal: 0 },
      food: { current: 0, goal: 0 },
      hygiene: { current: 0, goal: 0 },
      medicine: { current: 0, goal: 0 },
      clothes: { current: 0, goal: 0 }
    };
    centers.push(center);
    this.saveCenters(centers);
    return center;
  }

  updateOngGoals(centerId: number, goals: Record<SupplyKey, number>): boolean {
    const centers = this.centers();
    const center = centers.find(item => item.id === centerId);
    if (!center || Object.values(goals).some(goal => !Number.isFinite(goal) || goal < 1)) return false;

    center.water.goal = goals.water;
    center.food.goal = goals.food;
    center.hygiene.goal = goals.hygiene;
    center.medicine.goal = goals.medicine;
    center.clothes.goal = goals.clothes;
    center.need = 'Metas de arrecadação ativas';
    this.saveCenters(centers);
    return true;
  }

  createDonation(donation: Omit<Donation, 'id' | 'status' | 'createdAt'>): Donation {
    const donations = this.donations();
    const created: Donation = { ...donation, id: Date.now(), status: 'pending', createdAt: new Date().toISOString() };
    donations.unshift(created);
    this.saveDonations(donations);
    return created;
  }

  confirmDonation(id: number): void {
    const donations = this.donations();
    const donation = donations.find(item => item.id === id);
    if (!donation || donation.status !== 'pending') return;

    donation.status = 'received';
    const centers = this.centers();
    const center = centers.find(item => item.id === donation.centerId);
    if (center) {
      const resource = center[donation.supply];
      resource.current = Math.min(resource.goal, resource.current + donation.quantity);
      this.saveCenters(centers);
    }
    this.saveDonations(donations);
  }

  rejectDonation(id: number): void {
    const donations = this.donations();
    const donation = donations.find(item => item.id === id);
    if (donation?.status === 'pending') {
      donation.status = 'rejected';
      this.saveDonations(donations);
    }
  }

  posts(): Post[] {
    return this.storage.get<Post[]>(this.postsKey, [
      { id: 1, author: 'Salvador Solidário', verified: true, text: 'Precisamos de água mineral e produtos de higiene para famílias atendidas nesta semana.', likes: 37, comments: ['Vamos ajudar!'], created: 'Hoje' },
      { id: 2, author: 'Equipe ReliefFlow Salvador', verified: true, text: 'Nova campanha de arrecadação disponível. Consulte as metas dos pontos de apoio.', likes: 54, comments: [], created: 'Ontem' }
    ]);
  }

  savePosts(posts: Post[]): void { this.storage.set(this.postsKey, posts); }
}
