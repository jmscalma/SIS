import { Component } from '@angular/core';
import { updatePassword, type UpdatePasswordInput } from 'aws-amplify/auth';
import {
  confirmSignIn,
  signIn
} from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StrongPasswordValidator } from '../../../shared/validators/validators';

@Component({
  selector: 'app-force-change-password',
  templateUrl: './force-change-password.component.html',
  styleUrl: './force-change-password.component.css'
})
export class ForceChangePasswordComponent {

  isLogin: boolean = false;
  oldpassword!: any;
  newpassword!: any;
  password!: any;
  passwordmatch!: any;
  confirmpassword!: any;
  errorMessage: any;
  piForm!: FormGroup;

  constructor (public router: Router, public fb: FormBuilder){}

  ngOnInit(): void{

    this.piForm = this.fb.group({

      cpCtrl: ['', Validators.required],
      npCtrl: ['', Validators.required]

    })
  }

  validatePasswords(){
    this.passwordmatch = this.password === this.confirmpassword;
    if (this.password && this.confirmpassword && !this.passwordmatch){
      this.errorMessage = 'Passwords do not match';
    } else {
      this.errorMessage = ''
    }
  }

  async changepassword(form: any){

    this.isLogin = true;

    try{
      const {isSignedIn, nextStep} = await confirmSignIn({
        challengeResponse: this.password
      });
      this.isLogin = false;
      if (isSignedIn && nextStep.signInStep === 'DONE'){
        this.router.navigate(['dashboard']);
      }
    } catch (error: any) {
      this.isLogin = false;
      console.error('Error:', error);

      if(error._type === "InvalidPasswordException" && error.message) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = error.message;
      }
    } finally {
      this.isLogin = false;
    }
  }


}
