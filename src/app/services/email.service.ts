import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {

  private http = inject(HttpClient);

  private apiUrl = 'https://www.boycote.fr/api/';

  sendEmailRequest(formData: any) {
    return this.http.post(this.apiUrl +
      'send-email-request.php'
      , formData);
  }

  sendEmailAnnulation(formData: any) {
    return this.http.post(this.apiUrl +
      'send-email-annulation.php', formData);
  }




}
