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

  constructor(private swPush: SwPush, private apiRest: ApiRestService) {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        console.log('🚀 ~ file: app.component.ts:30 ~ sub:', sub);
        const token = JSON.parse(JSON.stringify(sub));

        this.apiRest.saveToken(token).subscribe(
          (res) => {
            console.log('res', res);
          },
          (err) => {
            console.log('err', err);
          }
        );
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }

  sendNotification() {}
}
