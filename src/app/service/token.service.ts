import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Provides the app with a spotify access token
 */
export class TokenService {

  /* the access token is needed for authentification at spotify api requests */
  access_token: string;
  /* the parameters which are got send back in the URI after login at spotify */ 
  params = {};
  
  constructor() {
      this.access_token = null;
      /* checks if the login redirect was done */
      if (localStorage.getItem('spotify_auth_state') != null) {
          this.params = this.getHashParams();
      }
   }

   /**
    * Extracts the parameters out of the redirected URI after spotify login
    */
  getHashParams() {
    let hashParams = {};  
    let e, r = /([^&;=]+)=?([^&;]*)/g;
      let q = window.location.hash.substring(1);
      while (e = r.exec(q)) {
          hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      this.access_token = hashParams["access_token"];
      return hashParams;
  }

  /**
   * Clears the access token and params to log the user out
   */
  logOut() {
    this.access_token = "";
    this.params = {};
    //debugging console.log("Should be logged out...");
  }
}
