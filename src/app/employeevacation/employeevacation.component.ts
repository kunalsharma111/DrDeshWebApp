import { Component, OnInit, Renderer2, ViewChild, ElementRef, PLATFORM_ID, Inject, Provider, EventEmitter } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DataTransferService, PatientRound2, Facility } from '../shared/data-transfer.service';
import { HttpErrorResponse, HttpClient, HttpEventType } from '@angular/common/http';
declare var $: any;
import { formatDate, CommonModule} from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employeevacation',
  templateUrl: './employeevacation.component.html',
  styleUrls: ['./employeevacation.component.scss']
})
export class EmployeeVacationComponent implements OnInit {
  roleType;
  vacationForm: FormGroup;
  submitted = false;
  get f() { return this.vacationForm.controls; }

  constructor(private spinnerService: Ng4LoadingSpinnerService,
              public service: DataTransferService, private http: HttpClient,
              public toastr: ToastrService, private formBuilder: FormBuilder) {}

  logout() {
    this.service.logout();
  }
  
  ngOnInit() {
    this.vacationForm = this.formBuilder.group({
      vacationFrom: ['', Validators.required],
      vacationTo: ['', Validators.required],
      vacationType: ['', Validators.required],
      vacationReason: ['', Validators.required]
    });
    if (this.service.getRole() === undefined ) {
      this.service.setRoleTypeAfterRefresh().subscribe(res => {
        this.roleType = res.userrole;
        this.service.setRole(res.userrole);
      });
    } else {
      this.roleType = this.service.getRole();
    }
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
    console.log('this.vacationForm', this.vacationForm);
    this.service.storeEmployeeVacation(this.vacationForm).subscribe(res => {
    });
    this.onReset();
  }

}
