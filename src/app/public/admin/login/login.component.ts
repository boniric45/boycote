import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';

  private auth = inject(AuthService);
  private router = inject(Router);


  submit() {
    this.error = '';

    this.auth.login(this.username, this.password).subscribe((res: any) => {
      if (res.success) {
        this.router.navigate(['/admin']);
      } else {
        this.error = 'Identifiants incorrects';
      }
    });
  }




}
