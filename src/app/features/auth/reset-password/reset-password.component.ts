import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SuccessDialogComponent } from '../../../shared/dialog/success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../../../shared/dialog/error-dialog/error-dialog.component';


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
  ref: DynamicDialogRef | undefined;


  constructor (private dialogService: DialogService, public router: Router, public fb: FormBuilder, public authService: AuthService){}

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
        this.successDialog();
        this.closeDialog();
      } catch (err) {
        this.showErrorDialog('Failed to update Password');
        this.errorMessage = 'Failed to update password. Please try again.';
        console.log(err);
      }
    } else {
      this.errorMessage = 'Please ensure all fields are filled out correctly.';
    }
  }

  successDialog() {
    this.dialogService.open(SuccessDialogComponent, {
      header: 'SUCCESS',
      width: '20%',
      height: '30%'
    });
  }

  showErrorDialog(errorMessage: string) {
    const ref = this.dialogService.open(ErrorDialogComponent, {
      data: { message: errorMessage },
      header: 'Error',
      width: '25%',
      height: '40%'
    });
  }

  closeDialog() {
    console.log("Closing dialog", this.ref);
    if (this.ref) {
      this.ref.close();
    } else {
      console.error("DynamicDialogRef is not available");
    }
  }

}
