import { inject } from 'aurelia-dependency-injection';
import { Session } from 'session/session';

@inject(Session)
export class Guests {
  constructor(session) {
    this.session = session;
    this.guestList = null;
  }

  activate() {
    this.session.http.fetch('person/guestlist')
      .then(response => {
        return response.json();
      }).then(data => {
        this.guestList = data;
      });
  }
}
