import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { signIn, type SignInInput } from 'aws-amplify/auth';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AppService } from '../../../app.service';
import { fetchAuthSession } from 'aws-amplify/auth';
import { AuthService } from '../auth.service';
import { SidenavComponent } from '../../../core/sidenav/sidenav.component';
import { signOut } from 'aws-amplify/auth';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  username: any = '';
  password: any = '';
  accessToken: any;

  constructor(private router: Router, private config: PrimeNGConfig, private authService: AuthService, private message: MessageService, private dialog: MatDialog){}

  ngOnInit() {
    this.config.ripple = true;
    this.logout();
}

async currentSession() {
  try {
    console.log('gasgs', await fetchAuthSession())
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    console.log(accessToken, idToken)
    this.accessToken = accessToken
    sessionStorage.setItem('AccessToken', this.accessToken);
    console.log(this.accessToken)
  } catch (err) {
    console.log(err);
  }
}

forgotPasswordDialog(){
  this,this.router.navigate(['/forgot-password'])
  // this.dialog.open(ForgotPasswordComponent)
}

async logout() {
  try {
    const logout = await signOut();
    console.log(logout)
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
    console.log('Next Step', nextStep);

    if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
      this.router.navigate(['change-password']);
    } else if (nextStep.signInStep === 'DONE') {
      this.currentSession();
      this.authService.redirectingToDashboard();
      console.log('Redirected Successfully')
    }

    this.message.add({ severity: 'success', summary: 'Success', detail: 'Login Successful.' });
    console.log('Sign in result');
  } catch (error) {
    console.log('Login Failed:', error);
    this.message.add({ severity: 'error', summary: 'Error', detail: 'Login failed. Please check your credentials and try again.' });
  }
}

btnCLick(){
  this.router.navigate(['dashboard'])
}

}
