import { Component, OnInit, Renderer2, ViewChild, ElementRef, PLATFORM_ID, Inject, Provider, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTransferService, PatientRound2, Facility } from '../shared/data-transfer.service';
import { HttpErrorResponse, HttpClient, HttpEventType } from '@angular/common/http';
declare var $: any;
import { formatDate, CommonModule} from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attchfile',
  templateUrl: './attchfile.component.html',
  styleUrls: ['./attchfile.component.scss']
})
export class AttchFileComponent implements OnInit {

  fileData: any = [];
  previewUrl: any = null;
  imagess: any = [];
  elements: any = [];
  loadFilesFromUrl ;

  // elements: any = [
  //   {documentname: 'Statement of SSC ', uploadbttonflag: false,
  //    documentstatus: 'Not Submited', filename: '' , documenttype: 'uploadfile', documentlink: '', templateform: ''},
  //   {documentname: 'Latest School Leaving Certificate', uploadbttonflag: false,
  //    documentstatus: 'Not Submited', filename: '', documenttype: 'uploadfile', documentlink: '', templateform: ''},
  //   {documentname: 'Cer. of Indian Nationality', uploadbttonflag: false,
  //    documentstatus: 'Not Submited', filename: '', documenttype: 'uploadfile', documentlink: '', templateform: '' },
  //    {documentname: 'Cer. of Domicile', uploadbttonflag: false,
  //    documentstatus: '', filename: '', documenttype: 'docusign', documentlink: 'a', templateform: ''},
  //    {documentname: 'Cer. of HSC', uploadbttonflag: false,
  //    documentstatus: 'Not Submited', filename: '', documenttype: 'downloadanduploadfile',
  //    documentlink: '', templateform: 'file_1598613389214.docx'}
  // ];

  constructor(private spinnerService: Ng4LoadingSpinnerService,
              public service: DataTransferService, private http: HttpClient,
              public toastr: ToastrService) {}

  logout() {
    this.service.logout();
  }

  fileProgress(indexOfelement, fileInput: any) {
    this.fileData[indexOfelement] = fileInput.target.files[0];
    if (fileInput.target.files[0]) {
      this.elements[indexOfelement].uploadbttonflag = true;
    }
  }

  onSave(indexOfelement, fileName) {
    const formData = new FormData();
    formData.append('file', this.fileData[indexOfelement]);
    formData.append('documentname', fileName);

    this.service.addEmployeeDetails(formData)
    .subscribe(res => {
      this.getUploadedFiles();
      this.elements[indexOfelement].uploadbttonflag = false;
      this.toastr.success('', 'File Upload Sucessfully!!');
    }, err => {
      this.toastr.error('', 'File Not Uploaded !!');
    });
  }

  ngOnInit() {
    this.service.getRequireDocuemnts().subscribe(res => {
      this.elements = res;
      this.getUploadedFiles();
    });

    const str = this.service.metcha;
    this.loadFilesFromUrl = str.substring(0, str.indexOf('api'));

  }

  getUploadedFiles() {
    this.service.getEmployeeDetails().subscribe(res => {
      this.imagess = res[0].files;
      if (res[0].files.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let uploadFileIndex = 0; uploadFileIndex < res[0].files.length; uploadFileIndex++) {
          // tslint:disable-next-line:prefer-for-of
          for (let requiredDocIndex = 0; requiredDocIndex < this.elements.length; requiredDocIndex++) {
            if ( res[0].files[uploadFileIndex].documentname.trim().toLowerCase( ) ===
              this.elements[requiredDocIndex].documentname.trim().toLowerCase( )) {
              this.elements[requiredDocIndex].documentstatus = res[0].files[uploadFileIndex].status;
              this.elements[requiredDocIndex].filename = res[0].files[uploadFileIndex].fiName;
              this.elements[requiredDocIndex].remark = res[0].files[uploadFileIndex].remark;

              break;
            }

          }
        }

      }
    });
  }

}
