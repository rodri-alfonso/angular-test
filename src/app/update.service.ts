import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class UpdateService {
  constructor(private swUpdate: SwUpdate) {
    this.swUpdate.checkForUpdate().then((response) => {
      console.log('response', response);
    });
    // this.swUpdate.activateUpdate().then(() => document.location.reload())
  }
}
