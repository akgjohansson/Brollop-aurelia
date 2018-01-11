import { inject } from 'aurelia-dependency-injection';
import { Session } from '../session/session';

@inject(Session)
export class Admin {
  constructor(session) {
    this.adminClass = 'col-xs-offset-1 col-xs-10 col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6 col-lg-offset-3 col-lg-6';
    this.name = '';
    this.swedish = '';
    this.english = '';
    this.session = session;
    this.administrator = false;
    this.password = '';
    this.chosenInfoItem = '';
    this.loadings = 0;
  }

  attached() {
    this.session.http.fetch('admin/loading')
    .then(response =>{
      return response.json();
    }).then(data =>{
      this.loadings = data;
    });
  }
  sendInfo() {
    if (this.name && this.swedish && this.english) {
      this.session.sendInfo(this.name, this.swedish, this.english)
        .then(response => {
          for (let i = 0; i < this.session.infos.length; i++) {
            if (this.session.infos[i].Name.toLowerCase() === this.name.toLowerCase()) {
              this.session.infos[i] = {
                'name': this.name,
                'swedish': this.swedish,
                'english': this.english
              };
            }
          }
          this.name = '';
          this.swedish = '';
          this.english = '';
        });
    }
  }
  login() {
    this.session.login(this.password)
      .then(response => {
        let statusCode = response.status;
        if (statusCode === 200) {
          this.administrator = true;
        }
      });
  }

  getInfoItem() {
    if (!this.chosenInfoItem) {
      this.name = '';
      this.swedish = '';
      this.english = '';
    } else {
      for (let i = 0; i < this.session.infos.length; i++) {
        if (this.chosenInfoItem == this.session.infos[i].Name) {
          let item = this.session.infos[i];
          this.name = item.Name;
          this.swedish = item.Swedish;
          this.english = item.English;
        }
      }
    }
  }
}

