import {inject} from 'aurelia-dependency-injection';
import {Session} from 'session/session';

@inject(Session)
export class Registration {
  constructor(session) {
    this.session = session;
    this.persons = [{'firstName': '', 'lastName': '', 'phone': '', 'email': '', 'foodPreference': [], 'going': true}];
    this.showFoodPreferences = true;
  }

  addFoodPreference() {
    
  }
}
