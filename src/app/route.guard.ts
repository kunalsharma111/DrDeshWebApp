import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataTransferService } from './shared/data-transfer.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  constructor(public service: DataTransferService) {}
  providerAllowPaths: Array<string> = ['/dash', '/patient', '/reports', '/moduledashboard',
                                      '/employeedash', '/attachfile', '/employeedash', '/employeefacility', '/facility', '/employeevacation', '/vacationhistory', '/insuranceinformation'];
  dataEntryAllowPaths: Array<string> = ['/moduledashboard'];
  dashBoards: Array<string> = ['/moduledashboard', '/dash', '/employeedash'];
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.dashBoards.includes(state.url)) {
      switch (state.url) {
        case '/employeedash':
          localStorage.setItem('moduleType', 'employee');
          break;
        case '/dash':
          localStorage.setItem('moduleType', 'patient');
          break;
        default:
          localStorage.setItem('moduleType', 'homedash');
          break;
      }
    }
    if (this.service.loggedIn()) {
      if (this.service.getRole() === 'Admin') {
        return true;
      } else {
          if (this.service.getRole() === 'Provider' && this.providerAllowPaths.includes(state.url)) {
          return true;
          } else if (this.dataEntryAllowPaths.includes(state.url)) {
          return true;
          } else {
          this.service.router.navigate(['/moduledashboard']);
          }
        }
      return true;
    } else {
      this.service.router.navigate(['/']);
    }
  }
}
