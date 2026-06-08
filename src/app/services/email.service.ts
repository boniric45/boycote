import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {

private http = inject(HttpClient);

private apiUrl = 'https://www.boycote.fr/api/send_email.php';

sendEmail(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }
  
  
}
