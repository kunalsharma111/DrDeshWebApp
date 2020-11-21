import { Component, OnInit } from '@angular/core';
import { DataTransferService, Admin } from '../shared/data-transfer.service';
import { HttpErrorResponse } from '@angular/common/http';
declare var $: any;


@Component({
  selector: 'app-moduledashboard',
  templateUrl: './moduledashboard.component.html',
  styleUrls: ['./moduledashboard.component.scss']
})
export class ModuleDashboardComponent implements OnInit {
  roleType;
  constructor(public service: DataTransferService) { }
  ngOnInit() {

    if (this.service.getRole() === undefined ) {
      this.service.setRoleTypeAfterRefresh().subscribe(res => {
        this.roleType = res.userrole;
        this.service.setRole(res.userrole);
      });
    } else {
      this.roleType = this.service.getRole();
    }

    $('.a1').hover( function () {
      $('.centered').css('display', 'block');
      $('.centered1').css('display', 'block');
    }, function () {
    });
  }

  setModuleType(moduleName) {
    localStorage.setItem('moduleType', moduleName);
  }

}

