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
  loadFilesFromUrl ;

  elements: any = [
    {documentname: 'Statement of SSC ', uploadbttonflag: false,
     documentstatus: 'Not Submited', filename: '' , documenttype: 'uploadfile', documentlink: '', defaultform: ''},
    {documentname: 'Latest School Leaving Certificate', uploadbttonflag: false,
     documentstatus: 'Not Submited', filename: '', documenttype: 'uploadfile', documentlink: '', defaultform: ''},
    {documentname: 'Cer. of Indian Nationality', uploadbttonflag: false,
     documentstatus: 'Not Submited', filename: '', documenttype: 'uploadfile', documentlink: '', defaultform: '' },
     {documentname: 'Cer. of Domicile', uploadbttonflag: false,
     documentstatus: '', filename: '', documenttype: 'docusign', documentlink: 'a', defaultform: ''},
     {documentname: 'Cer. of HSC', uploadbttonflag: false,
     documentstatus: 'Not Submited', filename: '', documenttype: 'downloadanduploadfile',
     documentlink: '', defaultform: 'file_1598613389214.docx'}
  ];

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
      this.ngOnInit();
      this.elements[indexOfelement].uploadbttonflag = false;
      this.toastr.success('', 'File Upload Sucessfully!!');
    }, err => {
      this.toastr.error('', 'File Not Uploaded !!');
  });
}

  ngOnInit() {
    const str = this.service.metcha;
    this.loadFilesFromUrl = str.substring(0, str.indexOf('api'));
    this.service.getEmployeeDetails().subscribe(res => {
      this.imagess = res[0].files;
      if (res[0].files.length > 0) {
        for(let j = 0; j < res[0].files.length; j++) {
          for(let i = 0; i < this.elements.length; i++) {
            if ( res[0].files[j].documentname === this.elements[i].documentname) {
              this.elements[i].documentstatus = res[0].files[j].status;
              this.elements[i].filename = res[0].files[j].fiName;
              break;
            }

          }
        }

      }
    });
  }

}
