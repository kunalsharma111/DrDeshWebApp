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
  // url = 'https://calendar.google.com/calendar/embed?src=integrativebalancedwellbeing%40gmail.com&ctz=America%2FNew_York';
  url = 'https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=Asia%2FKolkata&amp;src=YmFsd2VsbGJlaW5nbGxjQGdtYWlsLmNvbQ&amp;src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;src=N2E3aGtiOGI1cTZzMGlkYzNibmRmNmltYzBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;src=NW01dGhnNGY0dThza2JhNWVraHRyZmFqaXNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%23039BE5&amp;color=%2333B679&amp;color=%238E24AA&amp;color=%23F4511E&amp;color=%230B8043';
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

