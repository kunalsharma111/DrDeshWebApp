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
  selector: 'app-all-employee-invoice-history',
  templateUrl: './all-employee-invoice-history.component.html',
  styleUrls: ['./all-employee-invoice-history.component.scss']
})
export class AllEmployeeInvoiceHistoryComponent implements OnInit {
  modalRef: BsModalRef;
  // @ViewChild('search', { static: true }) search: ElementRef;
  constructor(public service: DataTransferService, public toastr: ToastrService, public fb: FormBuilder
    , private datePipe: DatePipe) { }

  invoiceStatus = ['Pending', 'Approved', 'Rejected'];
  employeeInvoiceHistories = [];
  searchString = '';
  invoicePeriods = [];
  invoiceForm: FormGroup;
  submitted = false;
  loadFilesFromUrl;
  employeeModelOpenIndex;
  employeeData = {
    fname: '',
    email: '',
    _id: '',
    invoices: {
      _id: '',
      remark: '',
      period: '',
      amount: '',
      filename: '',
      comment: '',
      status: ''
    }
  };

  get f() { return this.invoiceForm.controls; }

  ngOnInit() {
    this.invoiceForm = this.fb.group({
      name: ['', Validators.required],
      invoicePeriod: ['', Validators.required],
      invoiceStatus: ['', Validators.required]
    });
    this.getReceiptPeriod();
    this.availableReceiptPeriod();
    this.getPendingInvoiceHistory();
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

  getReceiptPeriod() {
    this.service.getReceiptPeriodData().subscribe(res => {
      res.sort(function (a, b) {
        return b.periodnumber - a.periodnumber
      });
      for (let index = 0; index < res.length; index++) {
        let periodFrom = new Date(res[index].periodfrom);
        let periodTo = new Date(res[index].periodto);
        periodFrom.setDate(periodFrom.getDate());
        periodTo.setDate(periodTo.getDate());
        this.invoicePeriods[index] = this.datePipe.transform(periodFrom, "MM-dd-yyyy") + ' To ' +
          this.datePipe.transform(periodTo, "MM-dd-yyyy");
      }
    });
  }

  availableReceiptPeriod() {
    this.service.availableReceiptPeriod().subscribe(res => {
      if (res.length === 1 && res[res.length - 1].periodnumber != undefined) {
        let periodFrom = new Date(res[res.length - 1].periodto);
        let periodTo = new Date(res[res.length - 1].periodto);
        periodFrom.setDate(periodTo.getDate() + 1);
        periodTo.setDate(periodTo.getDate() + 14);
        var param = {
          periodNumber: res[res.length - 1].periodnumber + 1,
          periodFrom: periodFrom,
          periodTo: periodTo
        }
        this.service.storeReceiptPeriodData(param).subscribe(res => {
        });
      }
    });
  }

  getPendingInvoiceHistory() {
    var params = {
      'invoiceStatus': 'Pending'
    }
    this.service.allInvoiceHistory(params).subscribe(res => {
      res = res.filter(function (employee) {
        return employee.invoices !== undefined && employee.invoices.filename;
      });
      this.employeeInvoiceHistories = res;
    });
  }

  setEmployeeInvoiceData(employee, employeedocumentsIndex) {
    this.employeeData = employee
    this.employeeModelOpenIndex = employeedocumentsIndex;
  }

  onReset() {
    this.submitted = false;
    this.invoiceForm.reset();
  }

  onSubmit() {
    this.submitted = true;
    // if (this.receiptForm.invalid) {
    //   return;
    // }
    this.service.allInvoiceHistory(this.invoiceForm.value).subscribe(res => {
      res = res.filter(function (employee) {
        return employee.invoices !== undefined && employee.invoices.filename;
      });
      this.employeeInvoiceHistories = res;
    });
    // this.onReset();
  }

  onSave(invoiceDocumentId, userId, remark, status) {
    const params = {
      'userId': userId,
      'docId': invoiceDocumentId,
      'invoiceStatus': status,
      'remark': remark.value
    };
    this.service.updateEmployeeInvoice(params)
      .subscribe(res => {
        console.log("hello" + res);
        this.employeeInvoiceHistories[this.employeeModelOpenIndex].invoices.remark = remark.value;
        this.employeeInvoiceHistories[this.employeeModelOpenIndex].invoices.status = status;
        if (status === 'Approved') {
          this.toastr.success('', 'Invoice Approved!!');
        } else {
          this.toastr.success('', 'Invoice Rejected!!');
        }
      }, err => {
        console.log(err);
        this.toastr.success('', 'Invoice Rejected Try Again!!');
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
