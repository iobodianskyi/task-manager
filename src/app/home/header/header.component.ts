import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AppUser } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { NoteService } from 'src/app/services/note.service';
import { CleanUpService } from 'src/app/services/cleanup.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuCollapsed: boolean;
  user: AppUser;
  userSubscribtion: Subscription;
  search: string;
  hasColorFilter: boolean = false;

  constructor(
    private router: Router,
    private utils: UtilsService,
    private account: AccountService,
    private notesService: NoteService,
    private clenup: CleanUpService) { }

  ngOnInit() {
    this.userSubscribtion = this.account.getAppUser()
      .subscribe(user => { this.user = user });
  }

  toggleMenu() {
    this.menuCollapsed = !this.menuCollapsed;
  }

  hideNavMenu() {
    this.menuCollapsed = false;
  }

  searchChanged() {
    this.search = this.search.trim();
    this.notesService.search$.next(this.search)
  }

  filterColor(color) {
    this.notesService.color$.next(color);
    this.hasColorFilter = !!color;
  }

  logout() {
    this.account.logout()
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.clenup.cleanUpAppData();
        this.router.navigate([this.utils.routes.root]);
      });
  }

  ngOnDestroy() {
    this.userSubscribtion.unsubscribe();
  }
}
