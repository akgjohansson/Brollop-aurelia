import { inject } from 'aurelia-dependency-injection';
import { Session } from 'session/session';

@inject(Session)
export class Guests {
  constructor(session) {
    this.session = session;
    this.guestList = null;
    this.viewGuestList = true;
    this.viewFoodList = false;
    this.foodPreferenceList = null;
  }

  activate() {
    this.session.http.fetch('person/guestlist')
      .then(response => {
        return response.json();
      }).then(data => {
        this.guestList = data;
        this.generateFoodPreferenceList();
      });
  }

  viewFoodPreferences() {
    this.viewGuestList = false;
    this.viewFoodList = true;
  }

  viewGuests() {
    this.viewGuestList = true;
    this.viewFoodList = false;
  }

  generateFoodPreferenceList() {
    let list = [];
    for (let company of this.guestList) {
      for (let person of company.Persons) {
        for (let pref of person.FoodPreferences) {
          let added = false;
          for (let i = 0; i < list.length; i++) {
            if (list[i].name === pref.SwedishName) {
              list[i].number++;
              added = true;
              break;
            }
          }
          if (!added) {
            list.push({'number': 1, 'name': pref.SwedishName});
          }
        }
      }
    }
    this.foodPreferenceList = list;
  }
}
