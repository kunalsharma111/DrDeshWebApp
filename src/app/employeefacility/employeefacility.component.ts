import { Component, OnInit, Renderer2, ViewChild, ElementRef, PLATFORM_ID, Inject, Provider, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTransferService, PatientRound2, Facility } from '../shared/data-transfer.service';
import { HttpErrorResponse, HttpClient, HttpEventType } from '@angular/common/http';
declare var $: any;
import { formatDate, CommonModule} from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employeefacility',
  templateUrl: './employeefacility.component.html',
  styleUrls: ['./employeefacility.component.scss']
})
export class EmployeeFacilityComponent implements OnInit {

  employeeFacilitySubcription: any = [];
  employeeSubscribed: any = [];
  facilities: any = [];

  constructor(public service: DataTransferService,
              public toastr: ToastrService) {}

  logout() {
    this.service.logout();
  }

  onCheckboxChange(event, facilityname, indexOfelement) {
    this.employeeFacilitySubcription[indexOfelement] = event.target.checked;
    if (event.target.checked) {
      this.facilities[indexOfelement].submitbutton = true;
    } else {
      this.facilities[indexOfelement].submitbutton = false;
    }
  }

  onSave(indexOfelement, facilityName) {

    const  params = {
      'facilityName': facilityName,
      'subscribeStatus': this.employeeFacilitySubcription[indexOfelement]
    };

    this.service.addfacilityForEmployee(params)
    .subscribe(res => {
      this.facilities[indexOfelement].subscribeStatus = true;
      this.toastr.success('', facilityName + ' Facility Subscribe Sucessfully!!');
    }, err => {
      this.toastr.error('', 'Facility Not Subscribe !!');
    });
  }

  ngOnInit() {
    this.service.getEmployeeFacility().subscribe(res => {
      console.log('res-0', res)
      this.facilities = res;
      this.getUploadedFiles();
    }, err => {
      this.facilities = [];
    });
  }

  getUploadedFiles() {
    this.service.getEmployeeSubscribeFacility().subscribe(res => {
      console.log('res-1', res)
      this.employeeSubscribed = res[0].facilities;
      if (res[0].facilities.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let subscribedIndex = 0; subscribedIndex < res[0].facilities.length; subscribedIndex++) {
          // tslint:disable-next-line:prefer-for-of
          for (let subscribeIndex = 0; subscribeIndex < this.facilities.length; subscribeIndex++) {
            if (res[0].facilities[subscribedIndex].facilityName.trim().toLowerCase( ) ===
              this.facilities[subscribeIndex].facilityname.trim().toLowerCase( )) {

              this.facilities[subscribeIndex].facilityStartDate = res[0].facilities[subscribedIndex].facilityStartDate;
              this.facilities[subscribeIndex].facilityEndDate = res[0].facilities[subscribedIndex].facilityEndDate;
              this.facilities[subscribeIndex].facilityCharges = 'USD' + ' ' + (res[0].facilities[subscribedIndex].facilityCharges || ' ..');
              this.facilities[subscribeIndex].submitbutton =  res[0].facilities[subscribedIndex].submitbutton;
              this.facilities[subscribeIndex].subscribeStatus =  res[0].facilities[subscribedIndex].subscribeStatus;

              break;
            }

          }
        }

      }
    });
  }

}
