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

  constructor(public service: DataTransferService) { }
  ngOnInit() {

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

