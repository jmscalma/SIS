import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { AuthService } from '../auth.service';
import { signOut } from 'aws-amplify/auth';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  username: any = '';
  password: any = '';
  accessToken: any;
  idToken: any;

  constructor(private router: Router, private config: PrimeNGConfig, private authService: AuthService, private message: MessageService, private dialog: MatDialog){}

  ngOnInit() {
    this.config.ripple = true;
    this.logout();
}

async currentSession() {
  try {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    this.accessToken = idToken
    sessionStorage.setItem('IdToken', String(idToken));
  } catch (err) {
    console.log(err);
  }
}

forgotPasswordDialog(){
  this,this.router.navigate(['/forgot-password'])
}

async logout() {
  try {
    const logout = await signOut();
    this.router.navigate(['login'])
  } catch (error) {
    console.log(error);
  }
}

async login() {

  const formData: any = {
    username: this.username,
    password: this.password,
  };

  try {
    const { isSignedIn, nextStep } = await this.authService.handleSignIn(formData);

    if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
      this.router.navigate(['change-password']);
    } else if (nextStep.signInStep === 'DONE') {
      this.currentSession();
      this.authService.redirectingToDashboard();
    }

    this.message.add({ severity: 'success', summary: 'Success', detail: 'Login Successful.' });
  } catch (error) {
    this.message.add({ severity: 'error', summary: 'Error', detail: 'Login failed. Please check your credentials and try again.' });
  }
}

btnCLick(){
  this.router.navigate(['dashboard'])
}

}
