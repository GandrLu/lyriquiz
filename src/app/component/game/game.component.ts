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
  
fetchLyrics(){
  this.songService.getSongs(this.newOffset())
  .subscribe( songs => {
    //debugging console.log("lyric received: ", songs);
    this.songdata.push(songs.items[0]);
    this.lyricService.getLyrics(songs)
    .subscribe(lyric => {
      this.lyrics.push(lyric);
      lyric.artist = songs.items[0].artists[0].name;
      lyric.songname = songs.items[0].name;
      //debugging console.log("LYRICS: ", this.lyrics);
      //debugging console.log("lyrics arr length: ", this.lyrics.length);
      this.progress = (this.lyrics.length * 20);
      this.lyricService.prepareQuestion(lyric).subscribe( question => {
        if(question.lyricSnippet.length < 5){
          this.lyrics.pop();
        } else {
          this.Questions.push(question);
        }
      });
      if(this.lyrics.length < 5){
        this.fetchLyrics();
      } else {
        for (let j = 0; j < 5; j++) {
          this.songService.getSongs(this.newOffset())
              .subscribe( song => this.songdata.push(song.items[0]));
              //debugging console.log("SONGS: ", this.songdata);
        }
        this.finalQuestions = this.lyricService.provideQuestions(this.Questions, this.songdata);
      };
            },
            error => {
              if(this.lyrics.length < 5){
                this.fetchLyrics();
              };
            })
      });
}


newOffset(){
  let newOffset: number;
  do{
    newOffset = this.helperService.getRandomInt(49);
  } while(this.offsets.includes(newOffset));
  return newOffset;
}

}
