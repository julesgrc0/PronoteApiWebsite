import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  password;
  username;
  isEmpty = true;
  COORD;
  isFormPassComplete = false;
  Session;
  Etab;
  Invalid = false;
  URL = document.location.href;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {}

  private getLocation(): Promise<any> {
    return new Promise((res, rej) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const crd = pos.coords;
          const lat = crd.latitude;
          const long = crd.longitude;
          this.COORD = { lat, long };
          res(this.COORD);
        },
        () => {
          res([]);
        },
        options
      );
    });
  }

  public Submit(username, password): void {
    this.isFormPassComplete = true;
    this.Session = { username, password };
    this.getLocation().then((coord) => {
      if (this.COORD) {
        this.getURLs(this.COORD.lat, this.COORD.long);
      }
    });
  }

  public Login(session, url): void {
    const params =
      '?password=' +
      session.password +
      '&username=' +
      session.username +
      '&url=' +
      url;
    this.http.post(this.URL + 'connexion' + params, {}).subscribe(
      (data: any) => {
        if (data.error === false) {
          localStorage.setItem('session', JSON.stringify(data.data));
          this.router.navigate(['/menu'], { state: { session: JSON.stringify(data.data) } });
        }
      },
      (err) => {
        this.isFormPassComplete = false;
        this.Invalid = true;
      }
    );
  }

  private getURLs(lat, long): void {
    const params = '?lat=' + lat + '&long=' + long;
    this.http
      .post(this.URL + 'location' + params, {})
      .subscribe((data: any) => {
        this.Etab = data;
      });
  }

  public chose(etabName, url): void {
    this.Login(this.Session, url);
  }

  private Verify(): void {
    if (this.password !== undefined && this.username !== undefined) {
      if (this.password.length > 5 && this.username.length > 0) {
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }
    } else {
      this.isEmpty = true;
    }
  }

  public PasswordChange(password): void {
    this.password = password;
    this.Verify();
  }
  public UsernameChange(username): void {
    this.username = username;
    this.Verify();
  }
}
