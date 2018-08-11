import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { TokenService } from './service/token.service';
import { AppRoutingModule } from './/app-routing.module';
import { AboutComponent } from './component/about/about.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { UserComponent } from './component/user/user.component';
import { MenuComponent } from './component/menu/menu.component';
import { GameComponent } from './component/game/game.component';
import { QuestionComponent } from './component/question/question.component';
import { StatisticsComponent } from './component/statistics/statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AboutComponent,
    NavbarComponent,
    UserComponent,
    MenuComponent,
    GameComponent,
    QuestionComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'lyriquiz'),
    AngularFirestoreModule,
    HttpClientModule,
    AppRoutingModule
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
