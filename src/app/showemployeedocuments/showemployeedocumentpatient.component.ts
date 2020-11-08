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
  fileData: any = [];
  loadFilesFromUrl;
  reponseForSearchEmployee;
  selectedQuantity;
  getAllDocuments;
  getAllDocumentsClone;
  employeeData = {
    _id: '',
    fname: '',
    notsubmited: '',
    files: []
  };

  statuses: any = ['Submited', 'Not Submited', 'Approved', 'Rejected'];

  registrationForm = this.fb.group({
    statusName: ['', [Validators.required]]
  });

  changeStatus() {
    this.service.getEmployeeDocuemnt({
      documentstatus : this.selectedQuantity
    }).subscribe(res => {
      this.reponseForSearchEmployee = res;
      this.employeeDocuments = res === 'no' ? [] : res;
    });
  }

  reset() {
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

    this.service.getRequireDocuemnts().subscribe(res => {
      this.getAllDocuments = Object.assign([], res);
      this.getAllDocumentsClone = Object.assign([], res);
    });

  }

  margeUploadAndReqireDocument() {
    var removeUploadDocFromReqDoc = [];
    var cloneOfAllReqDocuments = Object.assign([], this.getAllDocuments);;

    var index = 0;
    if(this.employeeData.files.length < this.getAllDocuments.length) {
      for(let reqireDocIndex = 0; reqireDocIndex < this.getAllDocuments.length; reqireDocIndex++) {
        for(let uploadDocIndex = 0; uploadDocIndex < this.employeeData.files.length; uploadDocIndex++) {
          if(this.employeeData.files[uploadDocIndex].documentname === this.getAllDocuments[reqireDocIndex].documentname && this.employeeData.files[uploadDocIndex].status !== 'Not Submited') {
            removeUploadDocFromReqDoc [index] = reqireDocIndex;
            this.employeeData.files[uploadDocIndex].uploadbttonflag = false;
            index++;
            break;
          }
        }
      }

      removeUploadDocFromReqDoc.sort(function(a, b){return a-b});
      for(let removeUploadDocFromReqDocIndex = 0; removeUploadDocFromReqDocIndex< removeUploadDocFromReqDoc.length; removeUploadDocFromReqDocIndex++) {
        cloneOfAllReqDocuments.splice(removeUploadDocFromReqDoc[removeUploadDocFromReqDocIndex],1);
        if(removeUploadDocFromReqDoc[removeUploadDocFromReqDocIndex+1] != undefined)
        {
          removeUploadDocFromReqDoc[removeUploadDocFromReqDocIndex+1] = removeUploadDocFromReqDoc[removeUploadDocFromReqDocIndex+1] - (1+removeUploadDocFromReqDocIndex);
        }
      }

      for(let cloneOfAllReqDocumentsIndex = 0; cloneOfAllReqDocumentsIndex <  cloneOfAllReqDocuments.length; cloneOfAllReqDocumentsIndex++) {
          this.employeeData.files.splice(this.employeeData.files.length, 0 , cloneOfAllReqDocuments[cloneOfAllReqDocumentsIndex])
          this.employeeData.files[this.employeeData.files.length-1].documentname = cloneOfAllReqDocuments[cloneOfAllReqDocumentsIndex].documentname;
          this.employeeData.files[this.employeeData.files.length-1].fiName = '';
          this.employeeData.files[this.employeeData.files.length-1].remark = '';
          this.employeeData.files[this.employeeData.files.length-1].uploadbttonflag = false;
          this.employeeData.files[this.employeeData.files.length-1].status = cloneOfAllReqDocuments[cloneOfAllReqDocumentsIndex].documentstatus;
      }
    }
  }

  fileProgress(indexOfelement, fileInput: any) {
    this.fileData[indexOfelement] = fileInput.target.files[0];
    if (fileInput.target.files[0]) {
      this.employeeData.files[indexOfelement].uploadbttonflag = true;
    }
  }

  setEmployeeData(employee, employeedocumentsIndex) {
    this.employeeModelOpenIndex = employeedocumentsIndex;
    this.employeeData = employee;
    if(this.employeeData.files.length !== 0 && this.employeeData.notsubmited !== 'true') {
      this.margeUploadAndReqireDocument();
    } else {
      this.employeeData.files = this.getAllDocumentsClone;
      this.employeeData.notsubmited = 'true';
      for(let reqireDocIndex = 0; reqireDocIndex < this.getAllDocumentsClone.length; reqireDocIndex++) {
        this.employeeData.files[reqireDocIndex].documentname = this.getAllDocumentsClone[reqireDocIndex].documentname;
        this.employeeData.files[reqireDocIndex].fiName = '';
        this.employeeData.files[reqireDocIndex].remark = '';
        this.employeeData.files[reqireDocIndex].uploadbttonflag = false;
        this.employeeData.files[reqireDocIndex].status = this.getAllDocumentsClone[reqireDocIndex].documentstatus;
      }
    }
  }

  logout() {
    this.service.logout();
  }

  onSaveFile(indexOfelement, fileName) {
    const formData = new FormData();
    formData.append('file', this.fileData[indexOfelement]);
    formData.append('documentname', fileName);
    formData.append('userId', this.employeeData._id);

    this.service.addEmployeeDocByAdmin(formData)
    .subscribe(res => {
      var response = res[0] === undefined ? res: res[0];

      for(let fileIndex = 0; fileIndex < response.files.length; fileIndex++) {
        if(response.files[fileIndex].documentname === fileName) {
          this.employeeData.files[indexOfelement].fiName = response.files[fileIndex].fiName;
          this.employeeData.files[indexOfelement].uploadbttonflag = false;
          this.employeeData.files[indexOfelement].status = response.files[fileIndex].status;
          this.employeeData.notsubmited = 'false';
          this.ngOnInit();
        }
      }
      this.toastr.success('', 'File Upload Sucessfully!!');
    }, err => {
      this.toastr.error('', 'File Not Uploaded !!');
    });
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
