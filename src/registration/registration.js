import { inject } from 'aurelia-dependency-injection';
import { Session } from 'session/session';
import $ from 'jquery';

@inject(Session)
export class Registration {
  constructor(session) {
    this.session = session;
    this.persons = [];
    this.persons.push(this.generatePerson());
    this.newFoodPreference = '';
    this.addPrefButton = false;
    this.displayPersons = true;
    this.comment = '';
    this.info = null;
    this.edit = false;
    this.editInProgress = false;
    this.editMessage = '';
    this.editCompanyId = '';
  }

  activate() {
    this.getInfo();
  }

  beginEdit() {
    this.edit = true;
    setTimeout(() => {$('#reference-code-input').focus();}, 10);
  }

  editRegistration() {
    let statusCode;
    this.session.http.fetch(`person/${this.referenceCode}`)
      .then(response => {
        statusCode = response.status;
        return response.json();
      }).then(data => {
        if (statusCode === 200) {
          this.editMessage = '';
          this.loadCompany(data);
          this.editInProgress = true;
          this.referenceCode = '';
        } else {
          this.editMessage = this.session.language === 'swe' ? 'Anmälan finns inte' : 'Registration does not exist';
        }
      });
  }

  loadCompany(company) {
    this.resetForm();
    this.persons = [];
    this.comment = company.Comment;
    this.editCompanyId = company.Id;
    for (let person of company.Persons) {
      this.persons.push(this.generatePerson());
      let i = this.persons.length - 1;
      this.persons[i].firstName = person.FirstName;
      this.persons[i].lastName = person.LastName;
      this.persons[i].phone = person.Phone;
      this.persons[i].email = person.Email;
      this.persons[i].going = person.Going;
      this.persons[i].foodPreferences = person.FoodPreferences;
    }
  }

  getInfo() {
    this.info = this.session.getInfo('registration');
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
    console.log(person);
    if (person.newFoodPreference === 0) {
      person.newPref = true;
      setTimeout(() => { $('#new-pref-text').focus(); }, 10);
    } else if (!person.newFoodPreference) {
      setTimeout(() => { this.addFoodPreference(person); }, 100);
    } else {
      this.addPrefButton = true;
    }
  }
  addPreferenceAfterClick(person) {
    this.message = '';
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
    this.newFoodPreference = '';
    this.addPrefButton = false;
    this.displayPersons = true;
    this.comment = '';
    this.edit = false;
    this.editInProgress = false;
    this.editMessage = '';
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

  sendForm() {
    let goodForm = true;
    let persons = [];
    for (let i = 0; i < this.persons.length; i++) {
      goodForm = this.inputValidation(this.persons[i]);
      if (!goodForm) {
        break;
      }
      persons.push(this.constructPersonDto(this.persons[i]));
    }
    if (goodForm) {
      this.session.sendForm(persons, this.comment);
    }
    console.log(this.message);
  }

  sendUpdate() {
    let goodForm = true;
    let persons = [];
    for (let i = 0; i < this.persons.length; i++) {
      goodForm = this.inputValidation(this.persons[i]);
      if (!goodForm) {
        break;
      }
      persons.push(this.constructPersonDto(this.persons[i]));
    }
    if (goodForm) {
      this.session.sendUpdate(persons, this.comment, this.editCompanyId);
      this.editInProgress = false;
    }
  }

  constructPersonDto(person) {
    return {
      'firstName': person.firstName,
      'lastName': person.lastName,
      'phone': person.phone,
      'email': person.email,
      'foodPreferences': person.foodPreferences,
      'going': person.going
    };
  }

  inputValidation(person) {
    if (this.isNotValid(person.firstName)) {
      this.message = this.session.language === 'swe' ? 'Förnamnet är inte ifyllt' : 'First name is not filled';
      return false;
    } else if (this.isNotValid(person.lastName)) {
      this.message = this.session.language === 'swe' ? 'Efternamet är inte ifyllt' : 'Last name is not filled';
      return false;
    } else if (this.isNotValid(person.phone)) {
      this.message = this.session.language === 'swe' ? 'Telefonnumret är inte ifyllt' : 'Phone number is not filled';
      return false;
    } else if (this.isNotValid(person.email)) {
      this.message = this.session.language === 'swe' ? 'Epostadressen är inte ifylld' : 'Email address is not filled';
      return false;
    }
    return true;
  }

  isNotValid(text) {
    if (!text) {
      return true;
    }
    let count = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        count++;
      }
    }
    if (count === text.length) {
      return true;
    }
    return false;
  }
}
