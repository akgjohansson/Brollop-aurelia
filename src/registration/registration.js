import { inject } from 'aurelia-dependency-injection';
import { Session } from 'session/session';
//import { setTimeout } from 'timers';

@inject(Session)
export class Registration {
  constructor(session) {
    this.session = session;
    this.persons = [];
    this.persons.push(this.generatePerson());
    this.newFoodPreference = '';
    this.addPrefButton = false;
    this.displayPersons = true;
  }

  activate() {
    console.log(this.persons);
  }

  generatePerson() {
    return {
      'firstName': '',
      'lastName': '',
      'phone': '',
      'email': '',
      'foodPreferences': [],
      'going': true,
      'newPref': false,
      'newFoodPreference': '',
      'showFoodPreferences': true,
      'id': this.persons.length,
      'prefToAdd': ''
    };
  }

  addFoodPreference(person) {
    this.message = '';
    if (person.newFoodPreference === 0) {
      person.newPref = true;
    } else if (!person.newFoodPreference) {
      setTimeout(() => { this.addFoodPreference(person); }, 100);
    } else {
      this.addPrefButton = true;
    }
  }
  addPreferenceAfterClick(person) {
    if (person.newPref) { // Enter new food preference
      if (person.prefToAdd) {
        for (let i = 0; i < this.session.foodPreferences.length; i++) {
          if (this.isFoodPreferenceInArray(this.session.foodPreferences, person.prefToAdd)) {
            person.newPref = false;
            person.newFoodPreference = person.prefToAdd;
            this.addPreferenceAfterClick(person);
            person.prefToAdd = '';
            if (this.session.language === 'swe') {
              this.message = `${this.session.foodPreferences[i].SwedishName} finns redan i menyn`;
            } else {
              this.message = `${this.session.foodPreferences[i].EnglishName} already exists in menu`;
            }
            break;
          }
        }
        if (!this.message) {
          let newPrefInstance = {
            'SwedishName': this.session.language === 'swe' ? person.prefToAdd : '',
            'EnglishName': this.session.language === 'eng' ? person.prefToAdd : ''
          };
          this.session.foodPreferences.push(newPrefInstance);
          person.foodPreferences.push(newPrefInstance);
          person.newPref = false;
          person.prefToAdd = '';
        }
      }
    } else if (person.newFoodPreference !== -1) {
      if (!this.isFoodPreferenceInArray(person.foodPreferences, person.newFoodPreference)) {
        person.foodPreferences.push({
          'SwedishName': this.session.language === 'swe' ? person.newFoodPreference : '',
          'EnglishName': this.session.language === 'eng' ? person.newFoodPreference : ''
        });
      }
    }
    person.newFoodPreference = -1;
    this.session.sortFoodPreferences();
    this.displayPersons = false;
    setTimeout(() => { this.displayPersons = true; }, 10);
    console.log(person);
    console.log(this.session.foodPreferences);
  }

  isFoodPreferenceInArray(foodArray, food) {
    for (let i = 0; i < foodArray.length; i++) {
      if (foodArray[i].SwedishName.toUpperCase() === food.toUpperCase() || foodArray[i].EnglishName.toUpperCase() === food.toUpperCase()) {
        return true;
      }
    }
    return false;
  }

  foodPreferenceList(person) {
    let preferenceList = '';
    let count = person.foodPreferences.length;
    for (let i = 0; i < count; i++) {
      if (this.session.language === 'swe') {
        preferenceList += person.foodPreferences[i].SwedishName;
      } else {
        preferenceList += person.foodPreferences[i].EnglishName;
      }
      if (i < count - 1) {
        preferenceList += ', ';
      } else if (i === (count - 1)) {
        if (this.session.language === 'swe') {
          preferenceList += ' och ';
        } else {
          preferenceList += ', and ';
        }
      }
    }
    console.log(preferenceList);
    return preferenceList;
  }

  addPerson() {
    this.persons.push(this.generatePerson());
    this.displayPersons = false;
    setTimeout(() => { this.displayPersons = true; }, 10);
  }

  resetForm() {
    this.persons = [this.generatePerson()];
    this.session.registrationReceived = false;
    this.session.getFoodPreferences();
  }

  removePerson(person) {
    let newPersonsList = [];
    let removed = false;
    for (let i = 0; i < this.persons.length; i++) {
      if (this.persons[i] !== person || removed) {
        newPersonsList.push(this.persons[i]);
      } else {
        removed = true;
      }
    }
    this.persons = newPersonsList;
    this.displayPersons = false;
    setTimeout(() => { this.displayPersons = true; }, 10);
  }
}
