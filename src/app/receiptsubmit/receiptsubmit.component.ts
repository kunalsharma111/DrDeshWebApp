import { Component, OnInit, Renderer2, ViewChild, ElementRef, PLATFORM_ID, Inject, Provider, EventEmitter } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DataTransferService, PatientRound2, Facility } from '../shared/data-transfer.service';
import { HttpErrorResponse, HttpClient, HttpEventType } from '@angular/common/http';
declare var $: any;
import { DatePipe } from '@angular/common';
import { formatDate, CommonModule} from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { json } from 'body-parser';

@Component({
  selector: 'app-receiptsubmit',
  templateUrl: './receiptsubmit.component.html',
  styleUrls: ['./receiptsubmit.component.scss']
})
export class ReceiptSubmitComponent implements OnInit {
  roleType;
  fileData: any = [];
  fileUrl;
  receiptPeriods = [];
  fileattched: Boolean = false;
  receiptTypes = ['Gas Receipt', 'Cell Phone Receipt', 'Other Receipt'];
  public receipts: any[] = [{
    id: 1,
    period: '',
    type: '',
    amount: '',
    comment: '',
    file: null
  }];
  @ViewChild('search', { static: false }) search: ElementRef;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
              public service: DataTransferService, private http: HttpClient,
              public toastr: ToastrService, private formBuilder: FormBuilder,
              private datePipe: DatePipe) {}


  addReceipt() {
    this.receipts.push({
      id: this.receipts.length + 1,
      type: '',
      amount: '',
      period:'',
      comment: '',
      file: null
    });
  }

  saveReceipts() {
    let flag = true;
    const formData = new FormData();
    for(let index =0; index < this.receipts.length; index++){
      formData.append("images[]", this.receipts[index].file);
    }
    formData.append('collection', JSON.stringify(this.receipts));
    this.service.saveReceiptData(formData).subscribe(res => {
      this.toastr.success('', 'Record Saved');
      this.receipts= [{
        id: 1,
        period: '',
        type: '',
        amount: '',
        comment: '',
        file: null
      }];
    }, err=>{
      this.toastr.error('', 'Record Not Saved !!');
    });
  }

  removeReceipt(i: number) {
    this.receipts.splice(i, 1);
  }

  fileProgress(indexOfelement, fileInput: any) {
    this.fileData[indexOfelement] = fileInput.target.files[0];
    this.receipts[indexOfelement].file = fileInput.target.files[0];

    var $preview = $(".preview");
      var fileReader = new FileReader();
      fileReader.readAsDataURL(fileInput.target.files[0]);
      fileReader.onload = () =>{
        $preview.attr("href", fileReader.result);
        this.fileUrl = fileReader.result
        $preview.show();
      // console.log('fileReader.result1', this.fileUrl)

      };
      this.fileattched = true;
      // console.log('fileReader.result', this.fileUrl)
  }

  ngAfterViewInit(){
    // console.log('search', this.search);
  }

  logout() {
    this.service.logout();
  }

  loadFile(fReader,indexOfelement) {
    fReader.readAsDataURL(this.receipts[indexOfelement].file);
  }
  
  ngOnInit() {
    this.service.getReceiptPeriodData().subscribe(res => {
      res.sort(function(a,b){
        return b.periodnumber - a.periodnumber
      });
      for(let index = 0;index< 7;index++){
        let periodFrom = new Date(res[index].periodfrom);
        let periodTo = new Date(res[index].periodto);
        periodFrom.setDate(periodFrom.getDate() - 1);
        periodTo.setDate(periodTo.getDate() - 1);
        this.receiptPeriods[index] = this.datePipe.transform(periodFrom , "MM-dd-yyyy") +' To ' +
        this.datePipe.transform(periodTo, "MM-dd-yyyy");;
      }
    });
    if (this.service.getRole() === undefined ) {
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
