import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  currentPath: PathObj[] = [];

  private _routerSub!: Subscription;
  ngOnInit(): void {
    this._routerSub = this.router.events.subscribe(ev => {
      if (!(ev instanceof NavigationEnd)) return;
      //get current paths
      const paths = ev.urlAfterRedirects
        .split('/')
        .slice(1)
        .filter(v => v.length);
      //construct the objects
      let accPath: string = '';
      this.currentPath = [];
      for (const path of paths) {
        accPath += '/' + path;
        this.currentPath.push({
          name: path,
          url: accPath,
        });
      }
    });
  }
  ngOnDestroy(): void {
    this._routerSub.unsubscribe();
  }
}

interface PathObj {
  name: string;
  url: string;
}
