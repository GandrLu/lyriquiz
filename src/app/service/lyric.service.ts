import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Songs } from '../models/songs';
import { Song } from '../models/song';
import { Lyric } from '../models/lyric';
import { Question } from '../models/question';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for lyric requests at lyrics.ovh API.
 * Provides also methods to get Question objects out of the lyrics.
 */
export class LyricService implements OnInit{
  public Lyrics: Lyric[] = [];
  public Questions: Question[] = [];
  
  constructor(private http: HttpClient, private helperService: HelperService) {
  }
  
  ngOnInit() {
  }
  
  /**
   * Request for a lyric by sending the artists name and the songs name from an array with songdata, provided earlier by the song service
   * @param songData the songs to get lyrics of
   */
  getLyrics(songData: Songs): Observable<Lyric>{
        let uri = 'https://api.lyrics.ovh/v1/' + songData.items[0].artists[0].name + '/' + songData.items[0].name;
        return this.http.get<Lyric>(uri);
  }

  /**
   * Takes the lyrics of a song and creates a question out of it.
   * @param fetchedLyric the lyrics of one song
   */
  prepareQuestion(fetchedLyric: Lyric): Observable<Question>{
    /* Uses regex to collect the positions of break lines in the lyrics string */
    let regex = /\n/gi, result, indicies = [];
    while( (result = regex.exec(fetchedLyric.lyrics)) ){
      indicies.push(result.index);
    }
    /* Gets a random index of the array with line break positions */
    let randIndex = this.helperService.getRandomInt(indicies.length);
    let newQuestion: Question = {};
    /* Slices the lyrics at the random line break position and at the position 3 line breaks before, 
    so is ensured even if randomly the last position is choosen, that the other position exists. 
    Stores this approx. 3 lines in the lyrics snippet property of the current question. */
    newQuestion.lyricSnippet = fetchedLyric.lyrics.slice(indicies[randIndex - 3] + 1, indicies[randIndex] + 1);
    /* Stores additional the artist and songname of the lyric snippet */
    newQuestion.artist = fetchedLyric.artist;
    newQuestion.songname = fetchedLyric.songname;
    /* Initializes the wrong answers  */
    newQuestion.washout = [{}];
    this.Questions.push(newQuestion);
    return of(newQuestion);
    //debugging console.log("Questions: ", this.Questions);
  }

  /**
   * Provides the questions with three wrong answers.
   * @param questions Questions to process
   * @param songs Songs to use
   */
  provideQuestions(questions: Question[], songs: Song[]){
      this.helperService.shuffle(questions);
      //debugging console.log("songs fpr prov: ", songs);
      /* Stores randomly three wrong songnames with every question. 
      Repeats the process if the choosen song is the same as the correct answer of if its already one of the wrong ones. */
      questions.forEach(question => {
        for(let i = 0; i < 3; i++){
          let randSong: Song = {};
          let repeat = false;
          do {
            repeat = false;
            randSong = songs[this.helperService.getRandomInt(songs.length)];
            question.washout.forEach( item => {
              if(item.songname == randSong.name){
                repeat = true;
              }
            });
          } while( randSong.name == question.songname || repeat );
          //debugging console.log("RAND SONG", question);
          question.washout.push({artist: randSong.artists[0].name, songname: randSong.name});
        }
        /* Needed because the question array has to be initialized with an empty property, which needs to be cleared out. */
        question.washout.shift();
      });
      return questions;
  }
  
  
}
