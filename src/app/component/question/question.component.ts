import { Component, OnInit } from '@angular/core';
import { Question } from '../../models/question';
import { GameComponent } from '../game/game.component';
import { HelperService } from '../../service/helper.service';
import { FirestoreService } from '../../service/firestore.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
})
/**
 * Displays a single question and prepares the next one or the result page.
 */
export class QuestionComponent implements OnInit {

  /* Array containing the prepared and provieded ready to use questions */
  public finalQuestions: Question[];
  /* Initialisation of the answer buttons */
  buttons: string[] = ['','','',''];

  constructor(
    private gameComponent: GameComponent,
    private helperService: HelperService,
    private userService: UserService) { }

  ngOnInit() {
    /* Gets the final questions from game component */
    this.finalQuestions = this.gameComponent.finalQuestions;
    /* Sets up the answer buttons */
    this.setButtons();
  }

  /**
   * Receives the clicked button and checks if that is the correct answer.
   * If not, it paints the button red and the button with the correct answer yellow.
   * Otherwise it paints the button green.
   * @param event the clicked answer button
   */
  checkAnswer(event: any){
    let target: any = event.currentTarget;
    let answer: string = event.currentTarget.innerHTML;
    let correctBtn: any = null;
    /* Takes the correct answer of the current question and tests it against the given answer */
    if (this.finalQuestions[this.gameComponent.actualQuestion].songname != answer){
      /* When the given answer is incorrect, the button containing the correct answer is located */
      let indexCorrect = this.buttons.indexOf(this.finalQuestions[this.gameComponent.actualQuestion].songname);
      let btnId = 'btn' + (indexCorrect + 1);
      correctBtn = document.getElementById(btnId);
      /* Button with correct answer is painted yellow */
      correctBtn.className = "btn btn-warning btn-lg btn-block";
      /* Clicked button with false answer is painted red */
      target.className = "btn btn-danger btn-lg btn-block";
    } else {
      /* Clicked button with correct answer is painted green */
      target.className = "btn btn-success btn-lg btn-block";
      /* Score is increased by one */
      this.gameComponent.score++;
    }
    /* Timeout to give the user 1 second to realize his success or failure */
    setTimeout(
      ()=>{
        /* After 1 second the counter for the current question is increased and when the game is not over, the buttons are painted neutrally
        and get set up with new answers for next question. */
        this.gameComponent.actualQuestion++;
        if(this.gameComponent.actualQuestion < 5){
          if(correctBtn != null){
            correctBtn.className = "btn btn-outline-secondary btn-lg btn-block";
          }
          target.className = "btn btn-outline-secondary btn-lg btn-block";
          this.setButtons();
        } else {
          /* When the game is over, the point of this game are added to the total points and the result page is shown (realized in html). */
          this.userService.totalpoints += this.gameComponent.score;
      }
    }
    ,1000
  )
  //console.log("answer: ", answer);
  }
  
  /**
   * Set a song for each button and shuffles it, so the position of the correct answer varies.
   */
  setButtons(){
    this.buttons[0] = this.finalQuestions[this.gameComponent.actualQuestion].songname;
    this.buttons[2] = this.finalQuestions[this.gameComponent.actualQuestion].washout[1].songname;
    this.buttons[3] = this.finalQuestions[this.gameComponent.actualQuestion].washout[2].songname;
    this.buttons[1] = this.finalQuestions[this.gameComponent.actualQuestion].washout[0].songname;
    this.helperService.shuffle(this.buttons);
  }

}
