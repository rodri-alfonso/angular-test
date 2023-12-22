import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { ApiRestService } from './api-rest.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-test';

  readonly VAPID_PUBLIC_KEY =
    'BCHF3qSYrnH-981aad1iH10JHRqAkH47QHDsXXpbigV5zQjh5gHddh74jlg9tNwIiWTCfl50W6l_0sYmLnjykvA';
  public tokenCompleted: any;

  constructor(private swPush: SwPush, private apiRest: ApiRestService) {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        this.tokenCompleted = JSON.stringify(sub);
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }

  sendNotification() {
    fetch('http://localhost:9000/api/enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: this.tokenCompleted,
    });
  }
}
