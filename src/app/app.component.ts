import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SwPush } from '@angular/service-worker';
const webpush = require('web-push');

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

  constructor(
    private swPush: SwPush // private newsletterService: NewsletterService
  ) {
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
        console.log('Subscription successful', token);
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }

  sendNotification() {
    const pushSubscription = {
      endpoint:
        'https://fcm.googleapis.com/fcm/send/cww-qIUbcDw:APA91bHVzOqVFBPeQyif-5F0BxMRsoQjyw2roXPW21pBPks45mdUD4kYt_8N71qy1lVi0Yo6YcAYGi7xVaWVtmJgoEUpMotrZO1eBZGokdvTItX5rG4hS_sN4dFnvDFLpf7H34-D9MfY',
      keys: {
        p256dh:
          'BHozctADQY4dOmYfkweU3_av1OBL9IJ_NCVxMpuALzkhg_cgZ-oGeTI6_y-nmLXWSQCGIYDn4WfBV0TnDwTjql8',
        auth: 'MPbZ-Lrwi6WodkEbRsbGFA',
      },
    };

    const payload = {
      notification: {
        title: '😄😄 Saludos',
        body: 'Subscribete a mi canal de YOUTUBE',
        vibrate: [100, 50, 100],
        // image:
        // 'https://avatars2.githubusercontent.com/u/15802366?s=460&u=ac6cc646599f2ed6c4699a74b15192a29177f85a&v=4',
        actions: [
          {
            action: 'explore',
            title: 'Go to the site',
          },
        ],
      },
    };

    webpush
      .sendNotification(pushSubscription, JSON.stringify(payload))
      .then((res: any) => {
        console.log('Enviado !!', res);
      })
      .catch((err: any) => {
        console.log('Error', err);
      });
  }
}
