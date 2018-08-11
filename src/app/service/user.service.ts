import { Injectable, OnInit } from '@angular/core';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FirestoreService } from './firestore.service';
import { User } from '../models/user';
import { isNull } from 'util';

@Injectable({
  providedIn: 'root'
})
/**
 * User service provides methods and values for user considering actions.
 */
export class UserService implements OnInit{

  /* Dummy object for userdata received from spotify API */
  userdata: Object = {
    "id" : "unknown",
    "country" : "",
    "display_name" : null,
    "href" : "",
    "external_urls": {
        "spotify": "https://open.spotify.com/user/acidyumyum"
    },
    "images" : [null, null, null],
    "product" : "",
    "type" : "",
  };
  /* Total game score of the user for the current session */
  public totalpoints: number = 0;

  constructor(private http: HttpClient, private tokenService: TokenService, private firestoreService: FirestoreService) {
    /* Only when the access token is gathered, the user data from spotify gets requested */
    if (this.tokenService.access_token !== null && this.tokenService.access_token !== undefined) {
      this.getUserData();
    }
  }

  ngOnInit() {
    
  }

  /**
   * Receives the user data from spotify, uses the access token
   */
  getUserData() {
      let uri = 'https://api.spotify.com/v1/me';
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.tokenService.access_token
        })
      };
      this.http.get(uri, httpOptions)
        .subscribe(
          res => {
            //debugging console.log('user api res: ', res);
            this.userdata = res;
            /* Checks if the spotify user is new to lyricquiz or not */
            this.getOrCreateUser(this.userdata["id"])});
  }

  /**
   * Checks if the user id is present in the firestore cloud, when not the user is saved as new document with his id.
   * @param checkId the spotify id of the user
   */
  getOrCreateUser(checkId: string) {
    var userIsInFirestore: boolean = false;
    /* Query for the userid */
    this.firestoreService.queryUser(checkId).then(res => res.subscribe(users => {
      /* no result, so new user document gets set */
      if(users.length == 0) {
        var newUser: User = {
          userid: checkId
        };
        this.firestoreService.setData(newUser);
      }
    }));
    /* current user is saved in firestore service */
    this.firestoreService.user.userid = this.userdata['id'];
    return userIsInFirestore;
  }
}
