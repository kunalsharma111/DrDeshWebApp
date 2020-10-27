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
  selector: 'app-userhistory',
  templateUrl: './userhistory.component.html',
  styleUrls: ['./userhistory.component.scss']
})
export class AllUserListComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('search', { static: true }) search: ElementRef;
  constructor(public service: DataTransferService, public toastr: ToastrService, public fb: FormBuilder) { }
  employeeHistories = [];
  roles = ['Admin', 'Provider', 'Data Entry Operator'];
  employeeStatus = ['Active', 'Inactive'];
  searchHistory;
  searchString = '';
  userForm: FormGroup;
  submitted = false;
  employeeData = {
    fname: '',
    lname:'',
    _id: '',
    remark: '',
    email: '',
    empstatus: '',
    userrole: ''
  };
  employeeModelOpenIndex;
  get f() { return this.userForm.controls; }
  
  ngOnInit() {
    this.userForm = this.fb.group({
      userRole: ['', Validators.required],
      userStatus: ['', Validators.required]
    });

    fromEvent(this.search.nativeElement, 'input')
      .pipe(map((event: any) => event.target.value), debounceTime(500), distinctUntilChanged())
      .subscribe(val => {
        if (val === '') {
          this.employeeHistories = [];
          this.searchHistory = val;
          return;
        }
        const params = {
          name: val
        };
        this.service.getEmployeeDocuemnt(params).subscribe(res => {
          this.employeeHistories = res === 'no' ? [] : res;
          this.searchHistory = val;
        });
      });
  }

  setEmployeeData(employee, employeedocumentsIndex) {
    this.employeeData = employee;
    this.employeeData.userrole = employee.userrole;
    this.employeeData._id = employee._id;
    this.employeeData.empstatus = employee.empstatus === undefined ? 'Active': employee.empstatus;
    this.employeeModelOpenIndex = employeedocumentsIndex;
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }

  onSubmit() {
    this.userForm.value.userId = this.employeeData._id;
    this.submitted = true;
    if (this.userForm.invalid && this.userForm.value.userId === undefined) {
      return;
    }
    this.service.updateEmployeeDetails(this.userForm.value).subscribe(res => {
      // this.employeeHistories = res;
      this.toastr.success('', 'User Details Updated')
    this.app();

    }, error=> {
      this.toastr.error('Something went wrong', 'Something went wrong')
    });
  }
  
  logout() {
    this.service.logout();
  }

  app() {
    setTimeout(() => {
      $('#myModal').modal('hide');
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
