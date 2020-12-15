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
  selector: 'app-allemployeereceipthistory',
  templateUrl: './allemployeereceipthistory.component.html',
  styleUrls: ['./allemployeereceipthistory.component.scss']
})
export class AllEmployeeReceiptHistoryComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('search', { static: true }) search: ElementRef;
  constructor(public service: DataTransferService, public toastr: ToastrService, public fb: FormBuilder
    ,private datePipe: DatePipe) { }

  receiptStatus = ['Pending', 'Approved', 'Rejected'];
  employeeReceiptHistories = [];
  searchString = '';
  receiptPeriods = [];
  receiptForm: FormGroup;
  submitted = false;
  loadFilesFromUrl;
  employeeModelOpenIndex;
  employeeData = {
    fname: '',
    email:'',
    receipts: {
      _id: '',
      remark: '',
      period: '',
      amount: '',
      receipttype: '',
      filename: '',
      comment: '',
      status: ''
    },
    _id: ''
  };

  get f() { return this.receiptForm.controls; }
  
  ngOnInit() {
    this.receiptForm = this.fb.group({
      receiptPeriod: ['', Validators.required],
      receiptStatus: ['', Validators.required]
    });
    this.getReceiptPeriod();
    this.availableReceiptPeriod();
    this.getPendingReceiptHistory();
    fromEvent(this.search.nativeElement, 'input')
      .pipe(map((event: any) => event.target.value), debounceTime(500), distinctUntilChanged())
      .subscribe(val => {
        if (val === '') {
          this.employeeReceiptHistories = [];
          this.getPendingReceiptHistory();
          return;
        }
        const params = {
          name: val
        };
        this.service.allReceiptHistory(params).subscribe(res => {
          res = res.filter(function (employee) {
            return employee.receipts !== undefined &&  employee.receipts.filename;
          });
          this.employeeReceiptHistories = res;
        });
      });
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
        this.receiptPeriods[index] = this.datePipe.transform(periodFrom , "MM-dd-yyyy") +' To ' +
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

  getPendingReceiptHistory() {
    var params = {
      'receiptStatus' : 'Pending'
    }
    this.service.allReceiptHistory(params).subscribe(res => {
      res = res.filter(function (employee) {
        return employee.receipts !== undefined &&  employee.receipts.filename;
      });
      this.employeeReceiptHistories = res;
    });
  }

  setEmployeeReceiptData(employee, employeedocumentsIndex) {
    this.employeeData = employee
    this.employeeModelOpenIndex = employeedocumentsIndex;
  }

  onReset() {
    this.submitted = false;
    this.receiptForm.reset();
  }

  onSubmit() {
    this.submitted = true;
    // if (this.receiptForm.invalid) {
    //   return;
    // }
    this.service.allReceiptHistory(this.receiptForm.value).subscribe(res => {
      res = res.filter(function (employee) {
        return employee.receipts !== undefined &&  employee.receipts.filename;
      });
      this.employeeReceiptHistories = res;
    });
    this.onReset();
  }
  
  onSave(receiptDocumentId, userId,remark, status){
    const  params = {
      'userId' : userId,
      'docId': receiptDocumentId,
      'receiptStatus': status,
      'remark': remark.value
    };
    this.service.updateEmployeeReceipt(params)
    .subscribe(res => {
      this.employeeReceiptHistories[this.employeeModelOpenIndex].receipts.remark = remark.value;
      this.employeeReceiptHistories[this.employeeModelOpenIndex].receipts.status = status;
      if (status === 'Approved') {
      this.toastr.success('', 'Receipt Approved!!');
      } else {
        this.toastr.success('', 'Receipt Rejected!!');
      }
    }, err => {
    this.toastr.success('', 'Receipt Rejected Try Again!!');
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