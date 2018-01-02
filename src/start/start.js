import {inject} from 'aurelia-dependency-injection';
import {Session} from 'session/session';

@inject(Session)
export class Start {
  constructor(session) {
    this.session = session;
    this.info = '';
  }

  activate() {
    console.log('activate');
    this.getInfo();
  }

  getInfo() {
    this.info = this.session.getInfo('start');
    console.log(this.info);
  }
}
