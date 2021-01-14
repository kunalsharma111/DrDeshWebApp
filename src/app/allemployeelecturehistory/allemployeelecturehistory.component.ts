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
  selector: 'app-allemployeelecturehistory',
  templateUrl: './allemployeelecturehistory.component.html',
  styleUrls: ['./allemployeelecturehistory.component.scss']
})
export class AllEmployeeLectureHistoryComponent implements OnInit {
  modalRef: BsModalRef;
  // @ViewChild('search', { static: true }) search: ElementRef;
  constructor(public service: DataTransferService, public toastr: ToastrService, public fb: FormBuilder
    ,private datePipe: DatePipe) { }

  lectureStatus = ['Pending', 'Approved', 'Rejected'];
  employeeLectureHistories = [];
  searchString = '';
  lecturePeriods = [];
  lectureForm: FormGroup;
  submitted = false;
  loadFilesFromUrl;
  employeeModelOpenIndex;
  employeeData = {
    fname: '',
    email:'',
    _id: '',
    lectures: {
      _id: '',
      remark: '',
      period: '',
      amount: '',
      filename: '',
      comment: '',
      status: ''
    }
  };

  get f() { return this.lectureForm.controls; }
  
  ngOnInit() {
    this.lectureForm = this.fb.group({
      name: ['', Validators.required],
      lecturePeriod: ['', Validators.required],
      lectureStatus: ['', Validators.required]
    });
    this.getReceiptPeriod();
    this.availableReceiptPeriod();
    this.getPendingLectureHistory();
    // fromEvent(this.search.nativeElement, 'input')
    //   .pipe(map((event: any) => event.target.value), debounceTime(500), distinctUntilChanged())
    //   .subscribe(val => {
    //     if (val === '') {
    //       this.employeeLectureHistories = [];
    //       this.getPendingLectureHistory();
    //       return;
    //     }
    //     const params = {
    //       name: val
    //     };
    //     this.service.allLectureHistory(params).subscribe(res => {
    //       res = res.filter(function (employee) {
    //         return employee.lectures !== undefined &&  employee.lectures.filename;
    //       });
    //       this.employeeLectureHistories = res;
    //     });
    //   });
    const str = this.service.metcha;
    this.loadFilesFromUrl = str.substring(0, str.indexOf('api'));
  }

  getReceiptPeriod(){
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
  }

  availableReceiptPeriod(){
    this.service.availableReceiptPeriod().subscribe(res => {
      if(res.length === 1 && res[res.length-1].periodnumber != undefined) {
          let periodFrom = new Date(res[res.length-1].periodto);
          let periodTo = new Date(res[res.length-1].periodto);
          periodFrom.setDate(periodTo.getDate()+1);
          periodTo.setDate(periodTo.getDate()+14);
          var param = {
            periodNumber : res[res.length-1].periodnumber +1,
            periodFrom: periodFrom,
            periodTo: periodTo
          }
          this.service.storeReceiptPeriodData(param).subscribe(res => {
          });
      }
    });
  }

  getPendingLectureHistory() {
    var params = {
      'lectureStatus' : 'Pending'
    }
    this.service.allLectureHistory(params).subscribe(res => {
      res = res.filter(function (employee) {
        return employee.lectures !== undefined &&  employee.lectures.filename;
      });
      this.employeeLectureHistories = res;
    });
  }

  setEmployeeLectureData(employee, employeedocumentsIndex) {
    this.employeeData = employee
    this.employeeModelOpenIndex = employeedocumentsIndex;
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
    this.service.allLectureHistory(this.lectureForm.value).subscribe(res => {
      res = res.filter(function (employee) {
        return employee.lectures !== undefined &&  employee.lectures.filename;
      });
      this.employeeLectureHistories = res;
    });
    // this.onReset();
  }
  
  onSave(lectureDocumentId, userId,remark, status){
    const  params = {
      'userId' : userId,
      'docId': lectureDocumentId,
      'lectureStatus': status,
      'remark': remark.value
    };
    this.service.updateEmployeeLecture(params)
    .subscribe(res => {
      this.employeeLectureHistories[this.employeeModelOpenIndex].lectures.remark = remark.value;
      this.employeeLectureHistories[this.employeeModelOpenIndex].lectures.status = status;
      if (status === 'Approved') {
      this.toastr.success('', 'Lecture Approved!!');
      } else {
        this.toastr.success('', 'Lecture Rejected!!');
      }
    }, err => {
    this.toastr.success('', 'Lecture Rejected Try Again!!');
    });
      
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