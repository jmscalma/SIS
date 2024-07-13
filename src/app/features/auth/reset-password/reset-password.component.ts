import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{

  isLogin: boolean = false;
  oldPassword: any;
  newPassword: any;
  comfirmNewPassword: any;
  confirmpassword!: any;
  passwordmatch!: any;
  errorMessage: any;
  piForm!: FormGroup;

  constructor (public router: Router, public fb: FormBuilder, public authService: AuthService, public dialog: MatDialog, public dialogRef: DialogRef){}

  ngOnInit(){

    this.piForm = this.fb.group({

      opCtrl: ['', Validators.required],
      npCtrl: ['', Validators.required],
      cnpCtrl: ['', Validators.required]

    })
  }

  validatePasswords(){
    this.passwordmatch = this.newPassword === this.confirmpassword;
    if (this.newPassword && this.confirmpassword && !this.passwordmatch){
      this.errorMessage = 'Passwords do not match';
    } else {
      this.errorMessage = ''
    }
  }

  async changePassword(form: any) {
    if (form.valid) {
      try {
        await this.authService.handleUpdatePassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        });
        this.dialogRef.close();
      } catch (err) {
        this.errorMessage = 'Failed to update password. Please try again.';
        console.log(err);
      }
    } else {
      this.errorMessage = 'Please ensure all fields are filled out correctly.';
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
