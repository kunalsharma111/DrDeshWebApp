import { Component, OnInit } from '@angular/core';
import { DataTransferService, Admin } from '../shared/data-transfer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;


@Component({
  selector: 'app-employeedashboard',
  templateUrl: './employeedashboard.component.html',
  styleUrls: ['./employeedashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  roleType;
  name = 'Set iframe source';
  url = 'https://calendar.google.com/calendar/embed?src=balwellbeing%40gmail.com&ctz=America%2FNew_York';
  urlSafe: SafeResourceUrl;

  constructor(public service: DataTransferService, public sanitizer: DomSanitizer) { }
  user;
  fname;
  role;
  metaData;
  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    if (this.service.getRole() === undefined ) {
      this.service.setRoleTypeAfterRefresh().subscribe(res => {
        this.roleType = res.userrole;
        this.service.setRole(res.userrole);
      });
    } else {
      this.roleType = this.service.getRole();
    }
    // this.fname = '';
    // // this.roleType = this.service.getRole();
    // this.service.getData()
    //   .subscribe(
    //     res => {
    //       this.user = res;
    //       this.fname = this.user.fname;
    //       this.role =  this.user.userrole;
    //       this.metaData = true;
    //     }, err => {
    //       console.log(err);
    //       if (err instanceof HttpErrorResponse) {
    //         this.service.router.navigateByUrl('/');
    //       }
    //     });
    const $button = document.querySelector('#sidebar-toggle');
    const $wrapper = document.querySelector('#wrapper');

    $button.addEventListener('click', (e) => {
      e.preventDefault();
      $wrapper.classList.toggle('toggled');
    });

    $('.a1').hover(function () {
      $('.centered').css('display', 'block');
      $('.centered1').css('display', 'block');
    }, function () {
      // on mouseout, reset the background colour
      // $('.centered').css('display', 'none');
      // $('.centered1').css('display', 'none');
    });
  }
  logout() {
    this.service.logout();
  }
  ap() {
    this.service.topatient('yes');
  }
  app() {
    this.service.toprovider('yes');
  }
  af() {
    this.service.tofacility('yes');
  }
  ai() {
    this.service.toinsurance('yes');
  }
  ae() {
    this.service.toexpensive('yes');
  }

}

