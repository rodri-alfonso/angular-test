import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SwUpdate } from '@angular/service-worker';

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
    private swUpdate: SwUpdate
  ) {
    // this.subscribeToNotifications();
  }

  ngOnInit(): void {
    this.swUpdate.checkForUpdate().then((response) => {
      console.log('checkForUpdate ->', response);
      this.isAlertOpen = response;
    });
  }

  handleReload() {
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
