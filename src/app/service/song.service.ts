import { Injectable, OnInit } from '@angular/core';
import { TokenService } from './token.service';
import { Observable, of, Subscribable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Songs } from '../models/songs';
import { Song } from '../models/song';
import { LyricService } from './lyric.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for song requests at spotify
 */
export class SongService implements OnInit{
  /* Dummy object for spotify song json */
  songData: Song[] = [
    {
    album: {name: "ukn"},
    name: "ukn",
    artists: [{"name": "ukn"}]
  },
];
  
  constructor(private http: HttpClient, private tokenService: TokenService, private lyricService: LyricService) {
  }

  ngOnInit() {
  }
  
  /**
   * Request of the users tracks, he most listened to
   * @param offset the index of the first entity to return
   */
  getSongs(offset: number): Observable<Songs>{
    let tempSongs: Song[] = [];
    let timeRange = "short_term";
    let limit = "1";
    let uri = 'https://api.spotify.com/v1/me/top/tracks?time_range=' + timeRange + '&offset=' + offset + '&limit=' + limit;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenService.access_token
      })
    };
    return this.http.get<Songs>(uri, httpOptions);
  }
}
