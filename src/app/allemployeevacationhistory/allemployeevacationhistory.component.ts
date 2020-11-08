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
  selector: 'app-allemployeevacationhistory',
  templateUrl: './allemployeevacationhistory.component.html',
  styleUrls: ['./allemployeevacationhistory.component.scss']
})
export class AllEmployeeVacationHistoryComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('search', { static: true }) search: ElementRef;
  constructor(public service: DataTransferService, public toastr: ToastrService, public fb: FormBuilder) { }
  roles = ['Pending', 'Approved', 'Rejected'];
  employeeVacationHistories = [];
  searchString = '';
  vacationForm: FormGroup;
  submitted = false;
  employeeData = {
    fname: '',
    email:'',
    Vacations: {
      _id: '',
      remark: '',
      vacationFrom: '',
      vacationTo: '',
      vacacationType: '',
      vacationReason: '',
      vacationStatus: ''
    },
    _id: ''
  };
  employeeModelOpenIndex;
  get f() { return this.vacationForm.controls; }
  
  ngOnInit() {
    this.vacationForm = this.fb.group({
      vacationFrom: ['', Validators.required],
      vacationTo: ['', Validators.required],
      vacationStatus: ['', Validators.required]
    });
    var params = {
      'vacationStatus' : 'Pending'
    }
    this.service.getAllEmployeeVacationHistory(params).subscribe(res => {
      if(res[0].Vacations === undefined) {
        this.employeeVacationHistories  = [];
      } else {
        this.employeeVacationHistories = res;
      } 
    });
    fromEvent(this.search.nativeElement, 'input')
      .pipe(map((event: any) => event.target.value), debounceTime(500), distinctUntilChanged())
      .subscribe(val => {
        if (val === '') {
          this.employeeVacationHistories = [];
          return;
        }
        const params = {
          name: val
        };
        this.service.getAllEmployeeVacationHistory(params).subscribe(res => {
          this.employeeVacationHistories = [];
          for (let employeeVacation = 0; employeeVacation < res.length; employeeVacation++) {
            if (res[employeeVacation].Vacations !==  undefined) {
              this.employeeVacationHistories.push(res[employeeVacation]);
            }
        }
        });
      });
    
  }

  setEmployeeVacationData(employee, employeedocumentsIndex) {
    this.employeeData = employee
    this.employeeModelOpenIndex = employeedocumentsIndex;
  }

  onReset() {
    this.submitted = false;
    this.vacationForm.reset();
  }

  onSubmit() {
    this.submitted = true;
    // if (this.vacationForm.invalid) {
    //   return;
    // }
    this.service.getAllEmployeeVacationHistory(this.vacationForm.value).subscribe(res => {
      this.employeeVacationHistories = res;
    });
    // this.onReset();
  }
  
  onSave(VacationDocumentId, userId,remark, status){
    const  params = {
      'userId' : userId,
      'docId': VacationDocumentId,
      'vacationStatus': status,
      'remark': remark.value
    };
    this.service.updateEmployeeVacation(params)
    .subscribe(res => {
    this.employeeVacationHistories[this.employeeModelOpenIndex].Vacations.remark = remark.value;
    this.employeeVacationHistories[this.employeeModelOpenIndex].Vacations.vacationStatus = status;
    if (status === 'Approved') {
    this.toastr.success('', 'Leave Approved!!');
    } else {
    this.toastr.success('', 'Leave Rejected!!');
    }
    var param = {'email': this.employeeData.email,
                  'name': this.employeeData.fname
                };
    this.service.getAllAdmins(param)
    .subscribe(res => {
    }, eroro=> {
    })
    }, err => {
    this.toastr.success('', 'Leave Rejected Try Again!!');
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
