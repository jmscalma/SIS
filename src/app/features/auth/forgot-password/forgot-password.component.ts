import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { DialogRef } from '@angular/cdk/dialog';
import { Stepper } from 'primeng/stepper';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{

  visible: boolean = false;
  username: any;
  confirmationCode: any;
  newPassword: any;
  confirmpassword!: any;
  passwordmatch!: any;
  errorMessage: any;
  piForm!: FormGroup;
  currentStep: 'username' | 'confirmationCode' | 'newPassword' = 'username';


  constructor (public router: Router, public fb: FormBuilder, public authService: AuthService, public dialog: MatDialog){}

  ngOnInit(): void {

  }

  backToLogin(){
    this.router.navigate(['/login'])
  }

  validatePasswords(){
    this.passwordmatch = this.newPassword === this.confirmpassword;
    if (this.newPassword && this.confirmpassword && !this.passwordmatch){
      this.errorMessage = 'Passwords do not match';
    } else {
      this.errorMessage = ''
    }
  }

  async handleResetPassword() {
    try {
      await this.authService.handleResetPassword(this.username);
      this.currentStep = 'confirmationCode'; // Move to the next step
    } catch (error) {
      console.error('Error resetting password:', error);
      this.errorMessage = 'Failed to reset password. Please try again.';
    }
  }

  // async confirmResetPassword() {
  //   try {
  //     await this.authService.confirmResetPassword(this.username, this.newPassword, this.confirmationCode);
  //     this.currentStep = 'newPassword'; // Move to the next step
  //   } catch (error) {
  //     console.error('Error confirming reset password:', error);
  //     this.errorMessage = 'Failed to confirm password reset. Please check your code and try again.';
  //   }
  // }

}
