import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ForceChangePasswordComponent } from './force-change-password/force-change-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DialogModule } from 'primeng/dialog';
import { Stepper, StepperModule } from 'primeng/stepper';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { DividerModule } from 'primeng/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [
    // LoginComponent,
    // ForceChangePasswordComponent

    ResetPasswordComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    HttpClientModule,
    ToastModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    StepperModule,
    InputOtpModule,
    ButtonModule,
    PasswordModule,
    TooltipModule,
    BrowserModule,
    FormsModule,
    DividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class AuthModule {


}
