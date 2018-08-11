import { Component, OnInit, NgModule } from '@angular/core';
import { TokenService } from '../../service/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../service/user.service';
import { FirestoreService } from '../../service/firestore.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
/**
 * Realizes the redirection to spotify login and back.
 */
export class LoginComponent implements OnInit {

    stateKey: string = 'spotify_auth_state';
    showLogin: boolean = true;
    userdata: any;
    private lyriquizLogo: any = '../../../assets/lyriquiz_logo.png';

    constructor(private http: HttpClient,
                private tokenService: TokenService,
                private userService: UserService,
                private firestoreService: FirestoreService) {}

    ngOnInit() {
        /* When logged in, the userdata from user service is taken */
        if (this.checkLoggedIn()){
            this.userdata = this.userService.userdata;
        }
    }

    /**
     * Redirects to spotify login and defines the needed parameters as well as it sends the id of the lyriquiz client
     * and the redirect uri to the login.
     */
    redirectToSpotifyLogin() {
        let client_id = 'c428954c583c47eb82094a9e5da4f618'; // CLIENT_ID
        let redirect_uri = 'http://localhost:4200/';        // REDIRECT_URI

        let state = this.generateRandomString(16);

        localStorage.setItem(this.stateKey, state);

        let scope = 'user-top-read';

        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&state=' + encodeURIComponent(state);
        url += '&show_dialog=true';

        window.location.href = url;
    }

    /**
     * Generates a random string, used as state key.
     * @param length lenght of random string
     */
    generateRandomString(length) {
        let text: string = '';
        let possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * Checks if the user is logged in correctly.
     */
    checkLoggedIn() {
        let access_token = this.tokenService.access_token,
        state = this.tokenService.params["state"];
        let storedState = localStorage.getItem(this.stateKey);

        if (access_token !== "" && (state == null)) {
            return false;
        } else {
            localStorage.removeItem(this.stateKey);
            if (access_token !== "") {
                this.showLogin = false;
                return true;
            } else {
                this.showLogin = true;
                return false;
            }
        }
    }

}
