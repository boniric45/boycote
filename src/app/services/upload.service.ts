import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private http = inject(HttpClient);

upload(formData: FormData) {
    return this.http.post<{ path: string }>('https://www.boycote.fr/api/upload.php', formData);
  }






}


