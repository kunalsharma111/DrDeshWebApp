import { Component, OnInit, Renderer2, ViewChild, ElementRef, PLATFORM_ID, Inject, Provider, EventEmitter } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTransferService, PatientRound2, Facility } from '../shared/data-transfer.service';
import { HttpErrorResponse, HttpClient, HttpEventType } from '@angular/common/http';
declare var $: any;
import { DatePipe } from '@angular/common';
import { formatDate, CommonModule } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { json } from 'body-parser';

@Component({
  selector: 'app-invoicesubmit',
  templateUrl: './invoicesubmit.component.html',
  styleUrls: ['./invoicesubmit.component.scss']
})
export class InvoicesubmitComponent implements OnInit {
  roleType;
  fileData: any = [];
  fileUrl;
  invoicePeriods = [];
  fileattched: Boolean = false;
  public invoice: any[] = [{
    id: 1,
    period: '',
    amount: '',
    comment: '',
    file: null
  }];
  @ViewChild('search', { static: false }) search: ElementRef;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    public service: DataTransferService, private http: HttpClient,
    public toastr: ToastrService, private formBuilder: FormBuilder,
    private datePipe: DatePipe) { }


  addInvoice() {
    this.invoice.push({
      id: this.invoice.length + 1,
      amount: '',
      period: '',
      comment: '',
      file: null
    });
  }

  saveInvoice() {
    const formData = new FormData();
    for (let index = 0; index < this.invoice.length; index++) {
      formData.append("images[]", this.invoice[index].file);
    }
    formData.append('collection', JSON.stringify(this.invoice));
    this.service.saveInvoiceData(formData).subscribe(res => {
      this.toastr.success('', 'Record Saved');
      this.invoice = [{
        id: 1,
        period: '',
        amount: '',
        comment: '',
        file: null
      }];
    }, err => {
      this.toastr.error('', 'Record Not Saved !!');
    });
  }

  removeInvoice(i: number) {
    this.invoice.splice(i, 1);
  }

  fileProgress(indexOfelement, fileInput: any) {
    this.fileData[indexOfelement] = fileInput.target.files[0];
    this.invoice[indexOfelement].file = fileInput.target.files[0];

    var $preview = $(".preview");
    var fileReader = new FileReader();
    fileReader.readAsDataURL(fileInput.target.files[0]);
    fileReader.onload = () => {
      $preview.attr("href", fileReader.result);
      this.fileUrl = fileReader.result
      $preview.show();
      // console.log('fileReader.result1', this.fileUrl)
    };
    this.fileattched = true;
    // console.log('fileReader.result', this.fileUrl)
  }

  logout() {
    this.service.logout();
  }

  loadFile(fReader, indexOfelement) {
    fReader.readAsDataURL(this.invoice[indexOfelement].file);
  }

  ngOnInit() {
    this.service.getReceiptPeriodData().subscribe(res => {
      res.sort(function (a, b) {
        return b.periodnumber - a.periodnumber
      });
      for (let index = 0; index < 7; index++) {
        let periodFrom = new Date(res[index].periodfrom);
        let periodTo = new Date(res[index].periodto);
        periodFrom.setDate(periodFrom.getDate());
        periodTo.setDate(periodTo.getDate());
        this.invoicePeriods[index] = this.datePipe.transform(periodFrom, "MM-dd-yyyy") + ' To ' +
          this.datePipe.transform(periodTo, "MM-dd-yyyy");
      }
    });
    if (this.service.getRole() === undefined) {
      this.service.setRoleTypeAfterRefresh().subscribe(res => {
        this.roleType = res.userrole;
        this.service.setRole(res.userrole);
      });
    } else {
      this.roleType = this.service.getRole();
    }
    // var $preview = $(".preview");
    // $preview.hide();
  }
}
