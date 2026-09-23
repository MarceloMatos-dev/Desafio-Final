import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { ComunidadeComponent } from './pages/comunidade/comunidade.component';
import { OngsComponent } from './pages/ongs/ongs.component';
import { PontosApoioComponent } from './pages/pontos-apoio/pontos-apoio.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PrivacidadeComponent } from './pages/privacidade/privacidade.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DoarComponent } from './pages/doar/doar.component';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'comunidade', component: ComunidadeComponent },
  { path: 'ongs', component: OngsComponent },
  { path: 'pontos-apoio', component: PontosApoioComponent },
  { path: 'doar/:id', component: DoarComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'privacidade', component: PrivacidadeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
