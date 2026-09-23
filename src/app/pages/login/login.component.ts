import {
  Component
}
from '@angular/core';
import {
  FormsModule
}
from '@angular/forms';
import {
  Router,
  RouterLink
}
from '@angular/router';
import {
  AuthService
}
from '../../core/services/auth.service';
@Component( {
  selector:'app-login',
  imports:[FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email='';
  password='';
  error='';
  constructor(private a:AuthService, private r:Router) {
  }
  go() {
    if(this.a.login(this.email, this.password))this.r.navigateByUrl('/home');
    else this.error='E-mail ou senha inválidos.'
  }
}
