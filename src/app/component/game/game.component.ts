import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SongService } from '../../service/song.service';
import { LyricService } from '../../service/lyric.service';
import { Song } from '../../models/song';
import { Lyric } from '../../models/lyric';
import { Question } from '../../models/question';
import { HelperService } from '../../service/helper.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html'
})
/**
 * Game component fetches the song data, lyrics and prepares and provides the questions.
 */
export class GameComponent implements OnInit {
  songdata: Song[] = [];
  songName: any;
  artistsName: any;
  lyrics: Lyric[];
  offsets: number[] = [];
  progress: any;
  public Questions: Question[] = [];
  public finalQuestions: Question[] = [];
  buttons: string[] = ['','','','']
  actualQuestion: number;
  score: number;
  
  constructor( 
    private songService: SongService,
    private lyricService: LyricService,
    private helperService: HelperService ) {
  }

  ngOnInit() {
    this.lyrics  = [{}];
    this.actualQuestion = 0;
    this.score = 0;
    this.lyrics = [];
    this.songdata = [];
    this.Questions = [];

    this.fetchLyrics();
  }
  
  /**
   * Method that uses song and lyric service to get questions.
   * It requests one single song after another, and after each song it requests the lyrics for the song,
   * after that, it makes a question out of the lyrics. This is repeated until there are five lyrics available for questions.
   * It is concatenated this way, to ensure that the questions are prepared only after there are lyrics available.
   */
  fetchLyrics(){
    /* Uses a random offset to avoid requesting always the same songs in the same order. */
    this.songService.getSongs(this.newOffset())
    .subscribe( song => {
      //debugging console.log("lyric received: ", song);
      /* Each song is stored in songdata array */
      this.songdata.push(song.items[0]);
      this.lyricService.getLyrics(song)
      .subscribe(lyric => {
        this.lyrics.push(lyric);
        /* Additionally to the lyrics the artist and songname is stored */
        lyric.artist = song.items[0].artists[0].name;
        lyric.songname = song.items[0].name;
        //debugging console.log("LYRICS: ", this.lyrics);
        //debugging console.log("lyrics arr length: ", this.lyrics.length);
        /* Progress status for the progress bar in html, maximum is 100, so 5 questions are multiplicated with 20. */
        this.progress = (this.lyrics.length * 20);
        /* Each lyric is prepared as question */
        this.lyricService.prepareQuestion(lyric).subscribe( question => {
          if(question.lyricSnippet.length < 5){
            /* Needed because lyrics array has to be initialized with an empty entity */
            this.lyrics.pop();
          } else {
            this.Questions.push(question);
          }
        });
        /* While there are not five lyrics, the process is repeated */
        if(this.lyrics.length < 5){
          this.fetchLyrics();
        } else {
          for (let j = 0; j < 5; j++) {
            /* When enough lyrics are gathered, five songs are additionally requested, to have enaough for the worng answers. */
            this.songService.getSongs(this.newOffset())
            .subscribe( song => this.songdata.push(song.items[0]));
            //debugging console.log("SONGS: ", this.songdata);
          }
          /* All questions are getting provided with wrong answers and are shuffled */
          this.finalQuestions = this.lyricService.provideQuestions(this.Questions, this.songdata);
        };
      },
      /* When the lyrics API not delivers lyrics for a song, the process is also repeated until five ones are delivered. */
      error => {
        if(this.lyrics.length < 5){
          this.fetchLyrics();
        };
      })
    });
}

/* Deliveres a random offset index of the maximal 50 tracks at spotify. 
Stores the used offsets and repeats when an offset is used twice. */
newOffset(){
  let newOffset: number;
  do{
    newOffset = this.helperService.getRandomInt(49);
  } while(this.offsets.includes(newOffset));
  return newOffset;
}

}
