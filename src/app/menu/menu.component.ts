import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  type = ['absences', 'homeworks', 'infos', 'marks', 'timetable'];
  session;
  All = {
    absences: [],
    contents: [],
    evaluations: [],
    homeworks: [],
    marks: [],
    infos: [],
    timetable: []
  };
  URL = document.location.href.replace(/menu/g, '');

  constructor(private router: Router, private http: HttpClient) {
    if (localStorage.getItem('session')) {
      this.session = JSON.parse(localStorage.getItem('session'));
    } else {
      if (this.router.getCurrentNavigation().extras.state === undefined) {
        this.router.navigate(['/']);
      } else {
        localStorage.setItem('session', this.router.getCurrentNavigation().extras.state.toString());
      }
    }
    this.session = JSON.parse(localStorage.getItem('session'));
    localStorage.removeItem('session');
  }

  ngOnInit(): void { }

  public Request(type): Promise<any> {
    return new Promise((res, rej) => {
      this.http.post(this.URL + 'user/' + type + '?id=' + this.session.id, {}).subscribe((data: any) => {
        if (data.error && data.data === 'null') {
          localStorage.removeItem('session');
          this.router.navigate(['/']);
          rej([]);
        } else {
          res(typeof data.data === 'string' ? JSON.parse(data.data) : data.data);
        }
      }, (err: any) => {
        rej(err);
      });
    });
  }

  private Clear(t): void {

    Object.keys(this.All).map(k => {
      if (k !== t) {
        this.All[k] = [];
      }
    });
  }

  public change(tab): void {
    this.Request(tab).then(data => {
      this.Clear(tab);
      console.log(data);

      switch (tab) {
        case 'absences':
          this.All.absences = data.totals.reverse();
          break;
        case 'infos':
          this.All.infos = data.reverse();
          break;
        case 'homeworks':
          this.All.homeworks = data.reverse();
          break;
        case 'marks':
          this.All.marks = data.subjects.reverse();
          break;
        case 'timetable':
          this.All.timetable = data.reverse();
          break;
        case 'evaluations':
          this.All.evaluations = data;
          break;
      }
    }).catch(_ => { });
  }

}
