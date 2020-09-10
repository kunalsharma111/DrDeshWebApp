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
  selector: 'app-showemployeedocumentpatient',
  templateUrl: './showemployeedocumentpatient.component.html',
  styleUrls: ['./showemployeedocumentpatient.component.scss']
})
export class ShowEmployeeDocuemntComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(public service: DataTransferService, public toastr: ToastrService, public fb: FormBuilder) { }

  @ViewChild('search', { static: true }) search: ElementRef;
  searchString = '';
  employeeModelOpenIndex;
  employeeDocuments = [];
  loadFilesFromUrl;
  reponseForSearchEmployee;
  selectedQuantity;
  employeeData = {
    _id: '',
    fname: '',
    files: []
  };

  statuses: any = ['Submited', 'Not Submited', 'Approved', 'Rejected'];

  registrationForm = this.fb.group({
    statusName: ['', [Validators.required]]
  });

  changeStatus() {
    console.log('selectedQuantity', this.selectedQuantity);
    console.log(this.employeeDocuments);
    this.service.getEmployeeDocuemnt({
      documentstatus : this.selectedQuantity
    }).subscribe(res => {
      this.reponseForSearchEmployee = res;
      this.employeeDocuments = res === 'no' ? [] : res;
    });
  }

  reset() {
    console.log('hi');
    this.selectedQuantity = '';
    this.searchString = '';
    this.employeeDocuments = [];
  }

  ngOnInit() {
    const str = this.service.metcha;
    this.loadFilesFromUrl = str.substring(0, str.indexOf('api'));
    // this.roleType = this.service.getRole();
    fromEvent(this.search.nativeElement, 'input')
      .pipe(map((event: any) => event.target.value), debounceTime(500), distinctUntilChanged())
      .subscribe(val => {
        if (val === '') {
          this.employeeDocuments = [];
          return;
        }
        const params = {
          name: val
        };
        this.service.getEmployeeDocuemnt(params).subscribe(res => {
          this.reponseForSearchEmployee = res;
          this.employeeDocuments = res === 'no' ? [] : res;
        });
      });

    const $button = document.querySelector('#sidebar-toggle');
    const $wrapper = document.querySelector('#wrapper');

    $button.addEventListener('click', (e) => {
      e.preventDefault();
      $wrapper.classList.toggle('toggled');
    });

  }

  setEmployeeData(employee, employeedocumentsIndex) {
    this.employeeModelOpenIndex = employeedocumentsIndex;
    this.employeeData = employee;
  }

  logout() {
    this.service.logout();
  }

  onSave(empId, documentname, indexOfelement, remark, status) {
    const  params = {
                      'documentstatus' : status,
                      'userId': empId,
                      'documentname': documentname,
                      'remark': remark.value
                    };
    this.service.attachmentRemarkByAdmin(params)
    .subscribe(res => {
      this.employeeDocuments[this.employeeModelOpenIndex].files[indexOfelement].remark = remark.value;
      this.employeeDocuments[this.employeeModelOpenIndex].files[indexOfelement].status = status;
      if (status === 'Approved') {
        this.toastr.success('', 'Document Approved!!');
      } else {
        this.toastr.success('', 'Document Rejected!!');
      }
    }, err => {
        this.toastr.success('', 'Document Rejected Try Again!!');
    });

  }


  submit(form: NgForm) {
    $('#myModal').modal('hide');
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
