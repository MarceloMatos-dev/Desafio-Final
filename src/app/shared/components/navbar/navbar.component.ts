import {
  Component
}
from '@angular/core';
import {
  RouterLink,
  RouterLinkActive
}
from '@angular/router';
import {
  AuthService
}
from '../../../core/services/auth.service';
@Component( {
  selector:'app-navbar',
  imports:[RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  open=false;
  constructor(public auth:AuthService) {
  }
}
