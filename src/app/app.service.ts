import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  public jwttoken!: string;
  search:any;
  public redirectUrl!: string;

  urlgetallstudent = environment.apiURL + '/allstudents'
  urlstudent = environment.apiURL + '/student'  

  constructor(public router: Router, public http: HttpClient) {  }

  getAllStudent(pageNo: number, pageSize: number, keyword: string): Observable<any[]> {
    let options = { headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ${this.jwttoken}`})};
    return this.http.get<any[]>(`${this.urlgetallstudent}?pageNo=${pageNo}&pageSize=${pageSize}&keyword=${keyword}`, options).pipe(
      map(data => data),
      retry(1),
      catchError(error => {
        if (error.status === 401) {
          console.error('Unauthorized request - 401');
          // this.router.navigate(['/login'])
        }
        return throwError(error);
      })
    );
  }

  getStudentById(id: any){
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.jwttoken}`}),
    };

      return this.http.get<any>(`${this.urlstudent}?student_id=${id}`, headers).pipe(
      map((data) => data),
      retry(1),
      catchError(this.handleError)
    );
  }

  updateStudentDetails(id: any){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.jwttoken}`});

    return this.http.patch<any>(`${this.urlstudent}`, id, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  disableStudent(id: any, form: any){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.jwttoken}`});
    return this.http.patch<any>(`${this.urlstudent}/disable?student_id=${id}`, form, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  activateStudent(id: any) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.jwttoken}` });
    return this.http.patch<any>(`${this.urlstudent}/activate?student_id=${id}`, {}, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  addStudent(form: any) {
    let headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.jwttoken}`}),
    };
    return this.http.post<any>(this.urlstudent, form, headers).pipe(
      map((data) => data),
      retry(1),
      catchError(this.handleError)
    );
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
