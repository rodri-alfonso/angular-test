import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiRestService {
  public url = 'http://localhost:55345';

  constructor(private http: HttpClient) {}

  saveToken(token: any) {
    return this.http.post(`${this.url}/save`, {
      body: { token },
    });
  }
}
