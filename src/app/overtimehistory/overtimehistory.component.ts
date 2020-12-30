import { Component, OnInit, ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
declare var $: any;
import { Patient, DataTransferService, PatientRound2, combined } from '../shared/data-transfer.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { from, fromEvent, pipe } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-overtimehistory',
  templateUrl: './overtimehistory.component.html',
  styleUrls: ['./overtimehistory.component.scss']
})
export class EmployeeOvertimeHistoryComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(public service: DataTransferService, public toastr: ToastrService,
     public fb: FormBuilder,
     private datePipe: DatePipe) { }

  employeeOvertimeHistories = [];
  overtimeStatus = ['Pending', 'Approved', 'Rejected'];
  overtimeForm: FormGroup;
  loadFilesFromUrl;
  submitted = false;
  overtimePeriods = [];
  get f() { return this.overtimeForm.controls; }
  
  ngOnInit() {
    this.service.getReceiptPeriodData().subscribe(res => {
      res.sort(function(a,b){
        return b.periodnumber - a.periodnumber
      });
      for(let index = 0;index< res.length;index++){
        let periodFrom = new Date(res[index].periodfrom);
        let periodTo = new Date(res[index].periodto);
        periodFrom.setDate(periodFrom.getDate() - 1);
        periodTo.setDate(periodTo.getDate() - 1);
        this.overtimePeriods[index] = this.datePipe.transform(periodFrom , "MM-dd-yyyy") +' To ' +
        this.datePipe.transform(periodTo, "MM-dd-yyyy");
      }
    });
    this.overtimeForm = this.fb.group({
      overtimePeriod: ['', Validators.required],
      overtimeStatus: ['', Validators.required]
    });
    this.service.getOvertimeHistoryForEmployee({}).subscribe(res => {
      if(res[0].overtimes === undefined) {
        this.employeeOvertimeHistories  = [];
      } else {
        this.employeeOvertimeHistories = res.length <= 5 ? res : res.slice(res.length-5);
      } 
    });
    const str = this.service.metcha;
    this.loadFilesFromUrl = str.substring(0, str.indexOf('api'));
  }

  onReset() {
    this.submitted = false;
    this.overtimeForm.reset();
  }

  onSubmit() {
    this.submitted = true;
    // if (this.receiptForm.invalid) {
    //   return;
    // }
    this.service.getOvertimeHistoryForEmployee(this.overtimeForm.value).subscribe(res => {
      this.employeeOvertimeHistories = res;
    });
    this.onReset();
  }
  

  logout() {
    this.service.logout();
  }

  app() {
    setTimeout(() => {
      $('#myModal').modal('show');
    }, 100);
  }
  apr() {
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
