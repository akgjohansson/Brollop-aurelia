import { inject } from 'aurelia-dependency-injection';
import { Session } from 'session/session';

@inject(Session)
export class Lodging {
  constructor(session) {
    this.session = session;
  }
}
