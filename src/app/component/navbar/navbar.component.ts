import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  
  constructor(private userService: UserService, private tokenService: TokenService) {}
  
}
