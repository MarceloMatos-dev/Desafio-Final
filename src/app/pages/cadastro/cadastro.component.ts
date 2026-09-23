import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { UserRole } from '../../models/models';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  accountType: 'user' | 'ong' = 'user';
  name = '';
  email = '';
  password = '';
  lgpd = false;
  error = '';

  ongName = '';
  cnpj = '';
  neighborhood = '';
  description = '';

  constructor(
    private auth: AuthService,
    private data: DataService,
    private router: Router
  ) {}

  onCnpjInput(): void {
    const digits = this.cnpj.replace(/\D/g, '').slice(0, 14);
    this.cnpj = digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  go(): void {
    this.error = '';

    if (this.password.length < 6) {
      this.error = 'A senha deve ter ao menos 6 caracteres.';
      return;
    }

    if (this.accountType === 'ong') {
      if (!this.ongName || !this.neighborhood || !this.cnpj) {
        this.error = 'Preencha o nome da ONG, CNPJ e bairro.';
        return;
      }

      if (!this.auth.isValidCnpj(this.cnpj)) {
        this.error = 'Informe um CNPJ válido.';
        return;
      }

      if (this.auth.cnpjExists(this.cnpj)) {
        this.error = 'Este CNPJ já está cadastrado no ReliefFlow.';
        return;
      }
    }

    const role: UserRole = this.accountType === 'ong' ? 'ong' : 'user';
    const user = this.auth.register(
      this.name,
      this.email,
      this.password,
      this.lgpd,
      role,
      role === 'ong' ? this.cnpj : undefined
    );

    if (!user) {
      this.error = 'Este e-mail ou CNPJ já está cadastrado.';
      return;
    }

    if (role === 'ong') {
      // A ONG é criada sem metas. Elas serão definidas após o cadastro, no perfil.
      const center = this.data.createOngCenter(
        user.id,
        this.ongName,
        this.neighborhood,
        this.description
      );
      this.auth.attachCenterToCurrentUser(center.id);
      this.router.navigateByUrl('/perfil');
      return;
    }

    this.router.navigateByUrl('/home');
  }
}
