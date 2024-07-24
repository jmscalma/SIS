import { Injectable } from '@angular/core';
import { SignInInput, signIn } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { signOut } from 'aws-amplify/auth';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, retry, throwError, Observable } from 'rxjs';

interface Environment {
  production: boolean;
  apiURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  student_id: any;
  public isLoggedin!: boolean;
  public jwttoken: any;
  search:any;
  public redirectUrl!: string;

  urlgetallstudent = environment.apiURL + '/allstudents'
  urlstudent = environment.apiURL + '/student'

  constructor(public router: Router, public http: HttpClient) {  }

  getAllStudent(pageNo: number, pageSize: number, keyword: string): Observable<any[]> {
    this.jwttoken = sessionStorage.getItem('AccessToken');
    if (!this.jwttoken) {
      console.error('No token found in sessionStorage');
      // Handle missing token scenario appropriately
      return throwError('No token found');
    }
    console.log('Authorization token:', this.jwttoken);
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.jwttoken}`
      })
    };

    return this.http.get<any[]>(`${this.urlgetallstudent}?pageNo=${pageNo}&pageSize=${pageSize}&keyword=${keyword}`, options).pipe(
      map(data => data),
      retry(1),
      catchError(error => {
        if (error.status === 401) {
          console.error('Unauthorized request - 401');
          this.router.navigate(['/login'])
          // Additional handling like refreshing token or redirecting to login
        }
        return throwError(error);
      })
    );
  }

  getStudentById(id: any){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
    };

      return this.http.get<any>(`${this.urlstudent}?student_id=${id}`, headers).pipe(
      map((data) => data),
      retry(1),
      catchError(this.handleError)
    );
  }

  updateStudentDetails(id: any){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});

    return this.http.patch<any>(`${this.urlstudent}`, id, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  disableStudent(form: any, id: any){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});

    return this.http.patch<any>(`${this.urlstudent}/disable?student_id=${id}`, form, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  activateStudent(id: any){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});

    return this.http.patch<any>(`${this.urlstudent}/activate?student_id=${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  addStudent(form: any) {
    console.log(this.urlstudent)
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
    };
    return this.http.post<any>(this.urlstudent, form, headers).pipe(
      map((data) => data),
      retry(1),
      catchError(this.handleError)
    );
  }

  redirecttoAddStudent(){
    this.router.navigate(['dashboard'])
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

  async currentAuthenticatedUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails?.authFlowType}`);
    } catch (err) {
      console.log(err);
    }
  }

  async handleSignOut() {
    try {
      await signOut();
      this.isLoggedin = false;
    } catch (error) {
      console.log('error signing out: ', error);
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
        this.isLoggedin = true;
        this.router.navigate(['/dashboard'])
      }else{
        this.isLoggedin = false;
      }
      console.log("isLoggedIn", this.isLoggedin)
      console.log(accessToken, idToken)
    } catch (err) {
      console.log(err);
      // this.dialog.open(ErrorMessageComponent, {data: { message: err}}).afterClosed().subscribe(data => {});
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
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
