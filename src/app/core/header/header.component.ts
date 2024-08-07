import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmationService, MenuItem } from 'primeng/api'; // Import ConfirmationService
import { AuthService } from '../../features/auth/auth.service';
import { ResetPasswordComponent } from '../../features/auth/reset-password/reset-password.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [ConfirmationService] // Provide ConfirmationService

})
export class HeaderComponent {

  path: string[] = [];
  username!: any;
  currentDate: Date = new Date();
  ref: DynamicDialogRef | undefined;

  constructor(private dialogService: DialogService, private router: Router, private confirmationService: ConfirmationService, private authService: AuthService){

    this.username = localStorage.getItem('CognitoIdentityServiceProvider.284g4btkfvbd4odhdon8o0niuj.LastAuthUser');
    this.router.events
    .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
    .subscribe((data: NavigationEnd) => {
      const parts = data.urlAfterRedirects.split('/').filter(part => part.length > 0);
      const decodedPath = parts.map(part => part.replace(/%20/g, ' '));
      this.path = decodedPath;
    });
  }

  resetPasswordClick() {
    this.ref = this.dialogService.open(ResetPasswordComponent, {
      width: '30%',
      height: '90%',
    });
    this.ref.onClose.subscribe(() => {
      console.log('Dialog closed');
    });
  }

  ngOnInit() {
    interval(1000).pipe(
      map(() => {
        this.currentDate = new Date();
      })
    ).subscribe();
  }

}

