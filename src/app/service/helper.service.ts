import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Provides the app with some helper methods, needed at multiple places.
 */
export class HelperService {

  constructor() { }
  
  /** 
   * Returns a random integer up to a maximum
   * @param max the maximal number
   */
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * Shuffles the entities of an array.
   * @param array the array to shuffle
   */
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle
    while (0 !== currentIndex) {
  
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

}
