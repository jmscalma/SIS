import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { SignInInput, signIn } from 'aws-amplify/auth';
import { updatePassword, type UpdatePasswordInput } from 'aws-amplify/auth';
import { resetPassword, type ResetPasswordOutput } from 'aws-amplify/auth';
import {
  confirmResetPassword,
  type ConfirmResetPasswordInput
} from 'aws-amplify/auth';

interface Environment {
  production: boolean;
  apiURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn:boolean = false;
  public redirectUrl!:string;

  constructor(private http: HttpClient, private router: Router) { }

  async handleConfirmResetPassword({
    username,
    confirmationCode,
    newPassword
  }: ConfirmResetPasswordInput) {
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword });
    } catch (error) {
      // console.log(error);
    }
  }

  async handleResetPasswordNextSteps(output: ResetPasswordOutput) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        // console.log(
        //   `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        // );
        // Collect the confirmation code from the user and pass to confirmResetPassword.
        break;
      case 'DONE':
        // console.log('Successfully reset password.');
        break;
    }
  }

  async handleResetPassword(username: string) {
    try {
      const output = await resetPassword({ username });
      this.handleResetPasswordNextSteps(output);
    } catch (error) {
      // console.log(error);
    }
  }

  async handleUpdatePassword({
    oldPassword,
    newPassword
  }: UpdatePasswordInput) {
    try {
      await updatePassword({ oldPassword, newPassword });
    } catch (err) {
      // console.log(err);
    }
  }

  async handleSignOut() {
    try {
      await signOut();
      this.isLoggedIn = false;
    } catch (error) {
      // console.log('error signing out: ', error);
    }
  }

  async currentAuthenticatedUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      // console.log(`The username: ${username}`);
      // console.log(`The userId: ${userId}`);
      // console.log(`The signInDetails: ${signInDetails?.authFlowType}`);
    } catch (err) {
      console.log(err);
    }
  }

  redirectingToDashboard(){
    this.router.navigate(['dashboard/main-dashboard'])
  }

  async handleSignIn({ username, password }: SignInInput) {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      return { isSignedIn, nextStep };
    } catch (error) {
      console.log('Error signing in', error);
      throw error; // Re-throw the error to handle it in the component
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      return !!accessToken && !!idToken;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async currentSession() {
    try {
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      if (accessToken && idToken){
        this.isLoggedIn = true;
        this.router.navigate(['dashboard/main-dashboard'])
      }else{
        this.isLoggedIn = false;
      }
      // console.log("isLoggedIn", this.isLoggedIn)
      // console.log(accessToken, idToken)
    } catch (err) {
      console.log(err);
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

}
