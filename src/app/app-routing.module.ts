import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './component/about/about.component';
import { UserComponent } from './component/user/user.component';
import { MenuComponent } from './component/menu/menu.component';
import { GameComponent } from './component/game/game.component';
import { StatisticsComponent } from './component/statistics/statistics.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'game', component: GameComponent },
  { path: 'about', component: AboutComponent },
  { path: 'user', component: UserComponent },
  { path: 'stats', component: StatisticsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { 
}
