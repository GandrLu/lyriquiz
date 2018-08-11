import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html'
})
/**
 * Component that gets the user data of the current user from userservice and displays it.
 */
export class UserComponent implements OnInit {
  
  userdata: any;

  constructor( private userService: UserService) { }

  ngOnInit() {
    this.userdata = this.userService.userdata;
  }

}
