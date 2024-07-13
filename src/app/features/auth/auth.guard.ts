import { CanActivateFn } from '@angular/router';
import { Injectable, Input, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild,
} from '@angular/router';

import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<true | UrlTree> | Promise<true | UrlTree> | true | UrlTree {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<true | UrlTree> | Promise<true | UrlTree> | true | UrlTree {
    return this.canActivate(route, state);
  }

  async checkLogin(url: string): Promise<true | UrlTree> {
    if (await this.authService.isAuthenticated()) {
      console.log(this.authService.isAuthenticated());
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Redirect to the login page
    return this.router.parseUrl('/login');
  }
}
