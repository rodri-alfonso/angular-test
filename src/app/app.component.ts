import { ApplicationRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'angular-test';
  isAlertOpen = false;

  readonly VAPID_PUBLIC_KEY =
    'BCHF3qSYrnH-981aad1iH10JHRqAkH47QHDsXXpbigV5zQjh5gHddh74jlg9tNwIiWTCfl50W6l_0sYmLnjykvA';
  public tokenCompleted: any;

  constructor(
    private swPush: SwPush,
    private http: HttpClient,
    private swUpdate: SwUpdate,
    private appRef: ApplicationRef
  ) {
    // this.subscribeToNotifications();
    this.onCheckUpdate();
  }

  // updateClient() {
  //   if (!this.swUpdate.isEnabled) {
  //     console.log('Not Enabled');
  //     return;
  //   }
  //   this.swUpdate.available.subscribe((event) => {
  //     console.log(`current`, event.current, `available `, event.available);
  //     if (confirm('update available for the app please conform')) {
  //       this.swUpdate.activateUpdate().then(() => location.reload());
  //     }
  //   });
  // }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      console.log('No disponible');
    }
    // const timeInterval = interval(10000);
    // // const timeInterval = interval(8 * 60 * 60 * 1000);

    // timeInterval.subscribe(() => {
    //   this.swUpdate.checkForUpdate().then((response) => {
    //     console.log('checkForUpdate ->', response);
    //   });
    // });
    this.swUpdate.checkForUpdate().then((response) => {
      console.log('checkForUpdate ->', response);
      this.isAlertOpen = response;
    });
  }

  onCheckUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(20000);
        // const timeInterval = interval(8 * 60 * 60 * 1000);

        timeInterval.subscribe(() => {
          this.swUpdate.checkForUpdate().then((response) => {
            console.log('checkForUpdate ->', response);
          });
        });
      }
    });
  }

  handleReload() {
    if (!this.swUpdate.isEnabled) {
      console.log('No disponible');
      return;
    }
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        const token = JSON.parse(JSON.stringify(sub));
        this.tokenCompleted = JSON.stringify(sub);

        this.saveToken(token).subscribe({
          complete: () => console.log('Notification saved!'),
        });
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }

  sendNotification() {
    this.http
      .post('http://localhost:9000/api/enviar', {
        token: this.tokenCompleted,
      })
      .subscribe({
        complete: () => console.log('Notification sent!'),
      });
  }

  handleUpdate() {
    window.location.reload();
  }

  saveToken(token: any) {
    return this.http.post(`http://localhost:9000/api/guardar`, {
      token,
    });
  }
}
