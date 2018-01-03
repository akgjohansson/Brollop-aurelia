import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-dependency-injection';
import { Router } from 'aurelia-router';

@inject(HttpClient, Router)
export class Session {
  constructor(http, router) {
    http.configure(config => {
      config
        .withBaseUrl('http://localhost:57041/')
        .withDefaults({
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });
      this.http = http;
    });
    this.router = router;
    this.menuItems = null;
    this.getMenuItems();
    this.language = 'swe';
    this.remainingDays = null;
    this.getRemainingDays();
    this.infos = [];
    this.getInfos();
    this.contacts = [];
    this.getContacts();
    this.foodPreferences = [];
    this.getFoodPreferences();
    this.registrationReceived = false;
  }

  getMenuItems() {
    this.http.fetch('menu')
      .then(response => {
        return response.json();
      }).then(data => {
        this.menuItems = data;
      });
  }

  getRemainingDays() {
    console.log('rem');
    this.http.fetch('start/remainingDays')
      .then(response => {
        return response.json();
      }).then(data => {
        this.remainingDays = data;
      });
  }

  getInfos() {
    this.http.fetch('info')
      .then(response => {
        return response.json();
      }).then(data => {
        this.infos = data;
      });
  }

  sendInfo(name, swedish, english) {
    let info = {
      name, swedish, english
    };
    console.log(info);
    console.log(json(info));
    let output = this.http.fetch('info', { method: 'POST', body: json(info) });
    return output;
  }

  getInfo(infoName) {
    let infoOutput = '';
    for (let i = 0; i < this.infos.length; i++) {
      if (this.infos[i].Name.toLowerCase() === infoName.toLowerCase()) {
        infoOutput = this.language === 'swe' ? this.infos[i].Swedish : this.infos[i].English;
        break;
      }
    }
    return infoOutput;
  }

  getContacts() {
    this.http.fetch('contact')
      .then(response => {
        return response.json();
      }).then(data => {
        this.contacts = data;
      });
  }

  getFoodPreferences() {
    this.http.fetch('foodpreference')
      .then(response => { return response.json(); })
      .then(data => {
        this.foodPreferences = data;
        this.sortFoodPreferences();
      });
  }

  sortFoodPreferences() {
    console.log('sorting');
    console.log(this.foodPreferences);
    let upperCaseNames = [];
    let sortedObjects = [];
    for (let i = 0; i < this.foodPreferences.length; i++) {
      if (this.language === 'swe') {
        upperCaseNames.push(this.foodPreferences[i].SwedishName.toUpperCase());
      } else {
        upperCaseNames.push(this.foodPreferences[i].EnglishName.toUpperCase());
      }
    }
    let sortedList = upperCaseNames.sort();
    console.log(sortedList);
    for (let i = 0; i < sortedList.length; i++) {
      for (let j = 0; j < this.foodPreferences.length; j++) {
        if (this.language === 'swe') {
          if (sortedList[i] === this.foodPreferences[j].SwedishName.toUpperCase()) {
            sortedObjects.push(this.foodPreferences[j]);
            continue;
          }
        } else {
          if (sortedList[i] === this.foodPreferences[j].EnglishName.toUpperCase()) {
            sortedObjects.push(this.foodPreferences[j]);
            continue;
          }
        }
      }
    }
    this.foodPreferences = sortedObjects;
    console.log(this.foodPreferences);
  }

  sendRegistration(persons) {
    let statusCode;
    this.http.fetch('registration', { method: 'post', body: json(persons) })
      .then(response => {
        statusCode = respnse.status;
        if (statusCode === 200) {
          this.registrationReceived = true;
        } else {
          this.registrationFailure = true;
        }
      });
  }

  login(password) {
    return this.http.fetch(`admin/${password}`);
  }
}
