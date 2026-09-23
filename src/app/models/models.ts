export type UserRole = 'user' | 'ong' | 'admin';
export type DonationStatus = 'pending' | 'received' | 'rejected';
export type SupplyKey = 'water' | 'food' | 'hygiene' | 'medicine' | 'clothes';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  lgpd: boolean;
  centerId?: number;
  cnpj?: string;
}

export interface ResourceGoal {
  current: number;
  goal: number;
}

export interface Center {
  id: number;
  name: string;
  location: string;
  description: string;
  ownerUserId?: number;
  verified: boolean;
  need: string;
  water: ResourceGoal;
  food: ResourceGoal;
  hygiene: ResourceGoal;
  medicine: ResourceGoal;
  clothes: ResourceGoal;
}

export interface Donation {
  id: number;
  userId: number;
  donorName: string;
  centerId: number;
  centerName: string;
  supply: SupplyKey;
  supplyLabel: string;
  quantity: number;
  status: DonationStatus;
  createdAt: string;
}

export interface Post {
  id: number;
  author: string;
  verified?: boolean;
  text: string;
  likes: number;
  comments: string[];
  created: string;
}
