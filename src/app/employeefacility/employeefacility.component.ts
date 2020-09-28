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

  fileData: any = [];
  imagess: any = [];
  facilities: any = [];

  constructor(public service: DataTransferService,
              public toastr: ToastrService) {}

  logout() {
    this.service.logout();
  }

  fileProgress(indexOfelement, facilityname, fileInput: any) {
    console.log(indexOfelement, fileInput, facilityname);
    // this.fileData[indexOfelement] = fileInput.target.files[0];
    // if (fileInput.target.files[0]) {
    //   this.elements[indexOfelement].uploadbttonflag = true;
    // }
  }

  onSave(indexOfelement, facilityName) {

    const formData = new FormData();
    formData.append('facilityname', facilityName);
    // formData.append('documentname', fileName);

    this.service.addfacilityForEmployee(formData)
    .subscribe(res => {
      // this.getUploadedFiles();
      // this.elements[indexOfelement].uploadbttonflag = false;
      this.toastr.success('', 'Facility Subscribe Sucessfully!!');
    }, err => {
      this.toastr.error('', 'Facility Not Subscribe !!');
    });
  }

  ngOnInit() {
    this.service.getEmployeeFacility().subscribe(res => {
      this.facilities = res;
      // this.getUploadedFiles();
    }, err => {
      this.facilities = [];
    });

    // const str = this.service.metcha;
    // this.loadFilesFromUrl = str.substring(0, str.indexOf('api'));

  }

  // checkForProvider(elements) {
  //   return JSON.stringify(this.provider) === JSON.stringify(elements.sort());
  // }

  // getUploadedFiles() {
  //   this.service.getEmployeeDetails().subscribe(res => {
  //     this.imagess = res[0].files;
  //     if (res[0].files.length > 0) {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let uploadFileIndex = 0; uploadFileIndex < res[0].files.length; uploadFileIndex++) {
  //         // tslint:disable-next-line:prefer-for-of
  //         for (let requiredDocIndex = 0; requiredDocIndex < this.elements.length; requiredDocIndex++) {
  //           if ( res[0].files[uploadFileIndex].documentname.trim().toLowerCase( ) ===
  //             this.elements[requiredDocIndex].documentname.trim().toLowerCase( )) {
  //             this.elements[requiredDocIndex].documentstatus = res[0].files[uploadFileIndex].status;
  //             this.elements[requiredDocIndex].filename = res[0].files[uploadFileIndex].fiName;
  //             this.elements[requiredDocIndex].remark = res[0].files[uploadFileIndex].remark;

  //             break;
  //           }

  //         }
  //       }

  //     }
  //   });
  // }

}
