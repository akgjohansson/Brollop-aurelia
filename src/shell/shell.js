import routes from './routes';
import { Session } from '../session/session';
import { Aurelia } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import { HttpClient} from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Aurelia, HttpClient, Router, EventAggregator)
export class Shell {
  constructor(aurelia, http, router, eventAggregator) {
    this.aurelia = aurelia;
    this.session;
    this.http = http;
    this.router = router;
    this.drawShell = true;
    this.ea = eventAggregator;
  }

  attached() {
    if (!this.session) {
      this.session = new Session(this.http, this.router);
      this.aurelia.use.instance(Session, this.session);
    }
  }

  configureRouter(config, router) {
    this.router = router;
    config.map(routes);
  }

  newLanguage(language) {
    this.session.language = language;
    this.ea.publish('language');
  }
}
