import { inject } from 'aurelia-dependency-injection';
import {Session } from 'session/session';

@inject(Session)
export class Contact {
  constructor(session) {
    this.session = session;
  }
}
