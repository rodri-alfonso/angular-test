import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-test';

  readonly VAPID_PUBLIC_KEY =
    'BCHF3qSYrnH-981aad1iH10JHRqAkH47QHDsXXpbigV5zQjh5gHddh74jlg9tNwIiWTCfl50W6l_0sYmLnjykvA';
  public tokenCompleted: any;

  constructor(private swPush: SwPush, private http: HttpClient) {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        const token = JSON.parse(JSON.stringify(sub));
        console.log('Subscription successful', token);
        this.tokenCompleted = JSON.stringify(sub);
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }

  sendNotification() {
    console.log(
      '🚀 ~ file: app.component.ts:42 ~ this.tokenCompleted:',
      this.tokenCompleted
    );
    this.saveToken(this.tokenCompleted).subscribe({
      complete: () => console.log('Notification sent!'),
    });
  }

  saveToken(token: any) {
    return this.http.post(`http://localhost:9000/api/enviar`, {
      token,
    });
  }
}
