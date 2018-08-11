import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
})
/**
 * Component to display the total points of the user
 */
export class StatisticsComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

}
