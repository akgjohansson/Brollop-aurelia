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
    .then(response =>{
      return response.json();
    }).then(data => {
      this.contacts = data;
    });
  }

  login(password) {
    return this.http.fetch(`admin/${password}`);
  }
}
