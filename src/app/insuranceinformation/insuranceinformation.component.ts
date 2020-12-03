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
  selector: 'app-insuranceinformation',
  templateUrl: './insuranceinformation.component.html',
  styleUrls: ['./insuranceinformation.component.scss']
})
export class InsuranceInformationComponent implements OnInit {
  modalRef: BsModalRef;
  receiptPeriod = [];
  constructor(private datePipe: DatePipe, public service: DataTransferService, public toastr: ToastrService, public fb: FormBuilder) { }
  // 24-aug to 06-sep
  // 07-sep to 20-sep
  // 21-sep to 04-oct
  // 05-oct to 18-oct
  // 19-oct to 01-nov
  // 02-nov to 15-nov
  // 16-nov to 29-nov
  // 30-nov to 13-dec
  // 14-dec to 27-dec
  // 28-dec to 10-jan
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
        this.receiptPeriod[index] = this.datePipe.transform(periodFrom , "MM-dd-yyyy") +' To ' +
        this.datePipe.transform(periodTo, "MM-dd-yyyy");;
      }
    });
    console.log('receiptPeriod',this.receiptPeriod);
  }

  addReceiptPeriod() {
    var param = {
      periodNumber : 20122,
      periodFrom: '2020-12-29T00:00:00',
      periodTo: '2021-01-11T00:00:00'
    }
    this.service.storeReceiptPeriodData(param).subscribe(res => {
      console.log('res', res);
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
