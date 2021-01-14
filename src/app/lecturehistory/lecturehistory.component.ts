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
  selector: 'app-lecturehistory',
  templateUrl: './lecturehistory.component.html',
  styleUrls: ['./lecturehistory.component.scss']
})
export class EmployeeLectureHistoryComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(public service: DataTransferService, public toastr: ToastrService,
     public fb: FormBuilder,
     private datePipe: DatePipe) { }

  employeeLectureHistories = [];
  lectureStatus = ['Pending', 'Approved', 'Rejected'];
  lectureForm: FormGroup;
  loadFilesFromUrl;
  submitted = false;
  lecturePeriods = [];
  get f() { return this.lectureForm.controls; }
  
  ngOnInit() {
    this.service.getReceiptPeriodData().subscribe(res => {
      res.sort(function(a,b){
        return b.periodnumber - a.periodnumber
      });
      for(let index = 0;index< res.length;index++){
        let periodFrom = new Date(res[index].periodfrom);
        let periodTo = new Date(res[index].periodto);
        periodFrom.setDate(periodFrom.getDate());
        periodTo.setDate(periodTo.getDate());
        this.lecturePeriods[index] = this.datePipe.transform(periodFrom , "MM-dd-yyyy") +' To ' +
        this.datePipe.transform(periodTo, "MM-dd-yyyy");
      }
    });
    this.lectureForm = this.fb.group({
      lecturePeriod: ['', Validators.required],
      lectureStatus: ['', Validators.required]
    });
    this.service.getLectureHistoryForEmployee({}).subscribe(res => {
      if(res[0].lectures === undefined) {
        this.employeeLectureHistories  = [];
      } else {
        this.employeeLectureHistories = res.length <= 5 ? res : res.slice(res.length-5);
      } 
    });
    const str = this.service.metcha;
    this.loadFilesFromUrl = str.substring(0, str.indexOf('api'));
  }

  onReset() {
    this.submitted = false;
    this.lectureForm.reset();
  }

  onSubmit() {
    this.submitted = true;
    // if (this.receiptForm.invalid) {
    //   return;
    // }
    this.service.getLectureHistoryForEmployee(this.lectureForm.value).subscribe(res => {
      this.employeeLectureHistories = res;
    });
    // this.onReset();
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
