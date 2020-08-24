import { Component, OnInit, Renderer2, ViewChild, ElementRef, PLATFORM_ID, Inject, Provider, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTransferService, PatientRound2, Facility } from '../shared/data-transfer.service';
import { HttpErrorResponse, HttpClient, HttpEventType } from '@angular/common/http';
declare var $: any;
import { formatDate, CommonModule} from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-attchfile',
  templateUrl: './attchfile.component.html',
  styleUrls: ['./attchfile.component.scss']
})
export class AttchFileComponent implements OnInit {
  fileData: File = null;
  previewUrl: any = null;
  imagess: any = [];
  loadFilesFromUrl ;
  fileUploadProgress: string = null;
  constructor(private spinnerService: Ng4LoadingSpinnerService, public service: DataTransferService, private http: HttpClient) {}
  employee = {
    file : '',
    test2 : ''
    };
  logout() {
    this.service.logout();
  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0];
  }

  preview() {
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (event) => {
      this.previewUrl = reader.result;
    };
  }

  submit(form) {
    console.log('this.images', this.imagess);
    const formData = new FormData();
    formData.append('file', this.fileData);
    formData.append('test2', form.value.test2);

    this.fileUploadProgress = '0%';
    this.service.addEmployeeDetails(formData)
    .subscribe(res => {
      this.employee = {
        file : '',
        test2 : ''
      };
      // if (events.type === HttpEventType.UploadProgress) {
      //   this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
      //   console.log(this.fileUploadProgress);
      // } else if (events.type === HttpEventType.Response) {
      //   this.fileUploadProgress = '';
      //   console.log(events.body);
      //   alert('SUCCESS !!');
      // }

    });
}

  ngOnInit() {
    const str = this.service.metcha;
    this.loadFilesFromUrl = str.substring(0, str.indexOf('api'));
    this.service.getEmployeeDetails().subscribe(res => {
      this.imagess = res[0].files;
    });
  }

}
