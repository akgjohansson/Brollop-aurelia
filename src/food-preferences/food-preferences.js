import { inject } from 'aurelia-dependency-injection';
import { Session } from 'session/session';
import { json } from 'aurelia-fetch-client';

@inject(Session)
export class FoodPreferences {
  constructor(session) {
    this.session = session;
    this.foodPreferences = [];
  }

  activate() {
    this.loadFoodPreferences();
  }

  loadFoodPreferences() {
    this.session.http.fetch('foodpreference')
      .then(response => {
        return response.json();
      }).then(data => {
        let foodPreferences = data;
        this.foodPreferences = [];
        for (let preference of foodPreferences) {
          this.foodPreferences.push({
            'Id': preference.Id,
            'SwedishName': preference.SwedishName,
            'EnglishName': preference.EnglishName,
            'Message': ''
          });
        }
      });
  }

  update(foodPreference) {
    let statusCode;
    this.session.http.fetch('foodpreference', {
      method: 'put', body: json({
        'Id': foodPreference.Id,
        'SwedishName': foodPreference.SwedishName,
        'EnglishName': foodPreference.EnglishName
      })
    })
      .then(response => {
        statusCode = response.status;
        return response.json();
      }).then(data => {
        foodPreference.Message = data;
      });
  }
}
