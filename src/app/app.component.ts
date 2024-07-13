import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signIn, type SignInInput } from 'aws-amplify/auth';

// interface UserLogin {
//   username: string;
//   password: string;
// }

// async function handleSignIn({ username, password }: SignInInput) {
//   try {
//     const { isSignedIn, nextStep } = await signIn({ username, password });
//     console.log('nakalogin')
//   } catch (error) {
//     console.log('error signing in', error);
//   }
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // username: any = '';
  // password: any = '';
  // title = 'amplify-test';

  // constructor(private router: Router){}


  // async login(form: any){
    // this.router.navigate(['/merchant/menu-management']);
//     console.log("Username", this.username)
//     console.log("Password", this.password)
//     const formData: any = {
//       username: this.username,
//       password: this.password,
//     };
//    await handleSignIn(formData)
// }
 }
