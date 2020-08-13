import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataTransferService } from './shared/data-transfer.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  constructor(public service: DataTransferService) {}
  providerAllowPaths: Array<string> = ['/dash', '/patient', '/reports'];

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.service.loggedIn()) {
      if (this.service.getRole() === 'Admin') {
        return true;
      } else {
        if (this.providerAllowPaths.includes(state.url)) {
          return true;
        } else {
          this.service.router.navigate(['/dash']);
        }
      }
      return true;
    } else {
      this.service.router.navigate(['/']);
    }
  }
}
