import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/user';
import { Observable, Subject, BehaviorSubject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to provide Firestore functionality.
 */
export class FirestoreService {
  /* Current user */
  public user: User = {};
  userCollection: AngularFirestoreCollection<User>;
  queryCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  userid$: BehaviorSubject<string>;
  querieduser: Observable<User[]>;

  /* Collects all users in the cloud */
  constructor( public afs: AngularFirestore ) {
    this.userCollection = this.afs.collection('users');
    this.users = this.userCollection.valueChanges();

  }
  
  getUsers(){
    return this.users;
  }
  
  /* Stores a user in the cloud */
  setData(data: User){
    this.userCollection.add(data);
  }

  /* Not used, was created for the attempt to store scores of users in the cloud */
  setScore(score: number){
    let data: User = {
      userid: this.user.userid,
      totalscore: score
    }
    this.userCollection.add(data);
  }

  /**
   * Queries the collection for a specifiy userid.
   * @param userid the id to query
   */
  async queryUser(userid: string){
    this.queryCollection = this.afs.collection('users', ref => {
      return ref.where('userid', '==', userid)
    });
    this.querieduser = this.queryCollection.valueChanges();
    return this.querieduser;
  }

}
