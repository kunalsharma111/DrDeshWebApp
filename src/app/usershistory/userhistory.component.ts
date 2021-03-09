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
import { JwtHelperService } from "@auth0/angular-jwt";

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
  formSubmitted = false;
  resetPasswordForm: FormGroup;
  submitted = false;
  employeeData = {
    fname: '',
    lname: '',
    _id: '',
    remark: '',
    email: '',
    empstatus: '',
    userrole: ''
  };
  employeeModelOpenIndex;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  get f() { return this.userForm.controls; }
  get ff() { return this.resetPasswordForm.controls; }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnInit() {
    this.createResetForm();
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
    this.employeeData.empstatus = employee.empstatus === undefined ? 'Active' : employee.empstatus;
    this.employeeModelOpenIndex = employeedocumentsIndex;
  }
  helper = new JwtHelperService();
  setEmployeeDataForPassword(employee, employeedocumentsIndex) {
    this.employeeData = employee;
    this.employeeData.userrole = employee.userrole;
    this.employeeData._id = employee._id;
    this.employeeData.empstatus = employee.empstatus === undefined ? 'Active' : employee.empstatus;
    this.employeeModelOpenIndex = employeedocumentsIndex;
    let loginUser = localStorage.getItem('token');
    let decodedToken = this.helper.decodeToken(loginUser);
    this.resetPasswordForm = this.fb.group({
      adminId: [decodedToken.subject, [Validators.required]],
      adminPassword: ['', [Validators.required]],
      userId: [this.employeeData._id, [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    });
  }

  createResetForm() {
    this.resetPasswordForm = this.fb.group({
      adminId: ['', [Validators.required]],
      adminPassword: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    });
  }

  MustMatch(password1: string, password2: string) {
    return (formGroup: FormGroup) => {
      const pass = formGroup.controls[password1];
      const confirmPass = formGroup.controls[password2];
      if (confirmPass.errors && !confirmPass.errors.mustMatch) {
        return;
      }

      // set error on confirmPass if validation fails
      if (pass.value !== confirmPass.value) {
        confirmPass.setErrors({ mustMatch: true });
      } else {
        confirmPass.setErrors(null);
      }
    }
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

    }, error => {
      this.toastr.error('Something went wrong', 'Something went wrong')
    });
  }

  logout() {
    this.service.logout();
  }

  checkAdminPassword() {
    this.formSubmitted = true;
    if (this.resetPasswordForm.invalid) { return; }
    console.log(this.resetPasswordForm.value);
    this.service.changePassword(this.resetPasswordForm.value).subscribe((data: any) => {
      console.log(data);
      if (data.status == true) {
        this.toastr.success("", "Password Changed Successfully");
        this.createResetForm();
      }
    }, error => {
      console.log(error);
      this.toastr.error("", error.error.msg);
    })
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
