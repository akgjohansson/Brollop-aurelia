import {inject} from 'aurelia-dependency-injection';
import {Session} from 'session/session';
import $ from 'jquery';

@inject(Session)
export class Info {
  constructor(session) {
    this.session = session;
    this.map = '';
    this.info = '';
    this.afterMap = '';
  }
  activate() {
    this.info = this.session.getInfo('info');
    this.map = this.session.getInfo('map');
    this.afterMap = this.session.getInfo('afterMap');
  }

  attached() {
    let width = $('#map').outerWidth(true);
    $('#map').outerHeight(width * 0.8);
  }
}
