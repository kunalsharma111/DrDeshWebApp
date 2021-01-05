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
  selector: 'app-allemployeeovertimehistory',
  templateUrl: './allemployeeovertimehistory.component.html',
  styleUrls: ['./allemployeeovertimehistory.component.scss']
})
export class AllEmployeeOvertimeHistoryComponent implements OnInit {
  modalRef: BsModalRef;
  // @ViewChild('search', { static: true }) search: ElementRef;
  constructor(public service: DataTransferService, public toastr: ToastrService, public fb: FormBuilder
    ,private datePipe: DatePipe) { }

  overtimeStatus = ['Pending', 'Approved', 'Rejected'];
  employeeOvertimeHistories = [];
  searchString = '';
  overtimePeriods = [];
  overtimeForm: FormGroup;
  submitted = false;
  loadFilesFromUrl;
  employeeModelOpenIndex;
  employeeData = {
    fname: '',
    email:'',
    _id: '',
    overtimes: {
      _id: '',
      remark: '',
      period: '',
      hour: '',
      comment: '',
      status: ''
    }
  };

  get f() { return this.overtimeForm.controls; }
  
  ngOnInit() {
    this.overtimeForm = this.fb.group({
      name: ['', Validators.required],
      overtimePeriod: ['', Validators.required],
      overtimeStatus: ['', Validators.required]
    });
    this.getReceiptPeriod();
    this.availableReceiptPeriod();
    this.getPendingOvertimeHistory();
    // fromEvent(this.search.nativeElement, 'input')
    //   .pipe(map((event: any) => event.target.value), debounceTime(500), distinctUntilChanged())
    //   .subscribe(val => {
    //     if (val === '') {
    //       this.employeeOvertimeHistories = [];
    //       this.getPendingOvertimeHistory();
    //       return;
    //     }
    //     const params = {
    //       name: val
    //     };
    //     this.service.allOvertimeHistory(params).subscribe(res => {
    //       res = res.filter(function (employee) {
    //         return employee.receipts !== undefined &&  employee.receipts.filename;
    //       });
    //       this.employeeOvertimeHistories = res;
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
        periodFrom.setDate(periodFrom.getDate()-1);
        periodTo.setDate(periodTo.getDate()-1);
        this.overtimePeriods[index] = this.datePipe.transform(periodFrom , "MM-dd-yyyy") +' To ' +
        this.datePipe.transform(periodTo, "MM-dd-yyyy");
      }
    });
  }

  //add period
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

  getPendingOvertimeHistory() {
    var params = {
      'overtimeStatus' : 'Pending'
    }
    this.service.allOvertimeHistory(params).subscribe(res => {
      res = res.filter(function (employee) {
        return employee.overtimes !== undefined ;
      });
      this.employeeOvertimeHistories = res;
    });
  }

  setEmployeeOvertimeData(employee, employeedocumentsIndex) {
    this.employeeData = employee
    this.employeeModelOpenIndex = employeedocumentsIndex;
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
    this.service.allOvertimeHistory(this.overtimeForm.value).subscribe(res => {
      res = res.filter(function (employee) {
        return employee.overtimes !== undefined ;
      });
      this.employeeOvertimeHistories = res;
    });
    // this.onReset();
  }
  
  onSave(overtimeDocumentId, userId,remark, status){
    const  params = {
      'userId' : userId,
      'docId': overtimeDocumentId,
      'overtimeStatus': status,
      'remark': remark.value
    };
    this.service.updateEmployeeOvertime(params)
    .subscribe(res => {
      this.employeeOvertimeHistories[this.employeeModelOpenIndex].overtimes.remark = remark.value;
      this.employeeOvertimeHistories[this.employeeModelOpenIndex].overtimes.status = status;
      if (status === 'Approved') {
      this.toastr.success('', 'Overtime Approved!!');
      } else {
        this.toastr.success('', 'Overtime Rejected!!');
      }
    }, err => {
    this.toastr.success('', 'Overtime Rejected Try Again!!');
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