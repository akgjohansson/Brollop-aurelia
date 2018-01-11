import {inject} from 'aurelia-dependency-injection';
import {Session} from 'session/session';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Session, EventAggregator)
export class About {
  constructor(session, eventAggregator) {
    this.session = session;
    this.info = '';
    this.ea = eventAggregator;
    this.drawAbout = true;
  }

  activate() {
    this.getAboutText();
    this.subscriber = this.ea.subscribe('language', () => {
      this.getAboutText();
    });
  }

  getAboutText() {
    //this.info = '';
    //this.drawAbout = false;
    this.info = this.session.getInfo('about');
  }
}
