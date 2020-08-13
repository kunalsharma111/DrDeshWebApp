import { Component, OnInit, Renderer2, ViewChild, ElementRef, PLATFORM_ID, Inject, Provider, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTransferService, PatientRound2, Facility } from '../shared/data-transfer.service';
import { HttpErrorResponse, HttpClient, HttpEventType } from '@angular/common/http';
declare var $: any;
import { formatDate, CommonModule} from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-shareddashboard',
  templateUrl: './shareddashboard.component.html',
  styleUrls: ['./shareddashboard.component.scss']
})
export class SharedDashboardComponent implements OnInit {
  roleType;
  user;
  fname;
  role;
  metaData;
  constructor(private spinnerService: Ng4LoadingSpinnerService, public service: DataTransferService, private http: HttpClient) {}

  logout() {
    this.service.logout();
  }

  ngOnInit() {
    if (this.service.getRole() === undefined ) {
      this.service.setRoleTypeAfterRefresh().subscribe(res => {
        this.roleType = res.userrole;
        this.service.setRole(res.userrole);
      });
    } else {
      this.roleType = this.service.getRole();
    }
    this.fname = '';
    // this.roleType = this.service.getRole();
    this.service.getData()
      .subscribe(
        res => {
          this.user = res;
          this.fname = this.user.fname;
          this.role =  this.user.userrole;
          this.metaData = true;
        }, err => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            this.service.router.navigateByUrl('/');
          }
        });
    const $button = document.querySelector('#sidebar-toggle');
    const $wrapper = document.querySelector('#wrapper');

    $button.addEventListener('click', (e) => {
      console.log('hi');
      e.preventDefault();
      $wrapper.classList.toggle('toggled');
    });
  }

}
