import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private account: AccountService,
    private router: Router,
    private utils: UtilsService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.account.getAuthState()
      .pipe(
        take(1),
        map(user => !!user),
        tap(loggedIn => {
          if (!loggedIn) { this.router.navigate([this.utils.routes.root]); }
        }));
  }
}
