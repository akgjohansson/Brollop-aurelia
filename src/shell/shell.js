import routes from './routes';
import { Session } from '../session/session';
import { Aurelia } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import $ from 'jquery';

@inject(Aurelia, HttpClient, Router, EventAggregator)
export class Shell {
  constructor(aurelia, http, router, eventAggregator) {
    this.aurelia = aurelia;
    this.session;
    this.http = http;
    this.router = router;
    this.drawShell = true;
    this.ea = eventAggregator;
    this.hamburgerCLass = 'side-menu-closed';
    this.viewHamburger = false;
  }

  attached() {
    if (!this.session) {
      this.session = new Session(this.http, this.router);
      this.aurelia.use.instance(Session, this.session);
    }
    this.setRouterViewSize();
  }

  setRouterViewSize() {
    let menuContainer = $('#menu-container');
    try {
      let menuDivBottom = menuContainer.position().top + menuContainer.outerHeight(true);
      let pageHostHeight = $('#page-host').outerHeight(true);
      let pageHostWidth = $('#page-host').innerWidth();
      console.log(menuDivBottom);
      let routerViewContainer = $('#router-view');
      routerViewContainer.css(`top: ${menuDivBottom}px;`);
      routerViewContainer.width(pageHostWidth);
      console.log(pageHostHeight - menuDivBottom);
      routerViewContainer.height(pageHostHeight - menuDivBottom);
      // routerViewContainer.css(`height: ${pageHostHeight - menuDivBottom}px`);
      console.log(routerViewContainer.outerHeight(true));
    } catch (error) {
      setTimeout(() => { this.setRouterViewSize(); }, 100);
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

  clickHamburger() {
    console.log('opening');
    this.viewHamburger = !this.viewHamburger;
  }

  sideMenuItemClick(route) {
    console.log('clicked');
    this.viewHamburger = false;
    this.session.router.navigate(route);
  }
}
