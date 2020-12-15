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
  selector: 'app-vacationhistory',
  templateUrl: './vacationhistory.component.html',
  styleUrls: ['./vacationhistory.component.scss']
})
export class EmployeeVacationHistoryComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(public service: DataTransferService,
              public toastr: ToastrService, public fb: FormBuilder, private datePipe: DatePipe) { }

  employeeVacationHistories = [];
  vacationForm: FormGroup;
  submitted = false;
  get f() { return this.vacationForm.controls; }
  
  ngOnInit() {
    this.vacationForm = this.fb.group({
      vacationFrom: ['', Validators.required],
      vacationTo: ['', Validators.required]
    });
    this.service.getVacationHistory({}).subscribe(res => {
      if(res[0].Vacations === undefined) {
        this.employeeVacationHistories  = [];
      } else {
        this.employeeVacationHistories = res.slice(res.length-5);
        this.fillterDate();
      } 
    });
  }

  onReset() {
    this.submitted = false;
    this.vacationForm.reset();
  }

  onSubmit() {
    this.submitted = true;
    if (this.vacationForm.invalid) {
      return;
    }
    this.service.getVacationHistory(this.vacationForm.value).subscribe(res => {
      this.employeeVacationHistories = res;
      this.fillterDate();
    });
    this.onReset();
  }
  
  fillterDate() {
    this.employeeVacationHistories.filter(s =>
      s.Vacations.vacationFrom = s.Vacations.vacationFrom.substring(5, 7) + '-' + s.Vacations.vacationFrom.substring(8, 10) + '-' +s.Vacations.vacationFrom.substring(0, 4) 
    );
    this.employeeVacationHistories.filter(s =>
      s.Vacations.vacationTo = s.Vacations.vacationTo.substring(5, 7) + '-' + s.Vacations.vacationTo.substring(8, 10) + '-' +s.Vacations.vacationTo.substring(0, 4)
    );
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
