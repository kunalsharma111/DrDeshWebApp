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
  templateUrl: './overtimesubmit.component.html',
  styleUrls: ['./overtimesubmit.component.scss']
})
export class OvertimeSubmitComponent implements OnInit {
  roleType;
  overtimePeriods = [];
  public overtimes: any[] = [{
    id: 1,
    period: '',
    hour: '',
    comment: ''
  }];
  @ViewChild('search', { static: false }) search: ElementRef;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
              public service: DataTransferService, private http: HttpClient,
              public toastr: ToastrService, private formBuilder: FormBuilder,
              private datePipe: DatePipe) {}


  addOvertime() {
    this.overtimes.push({
      id: this.overtimes.length + 1,
      hour: '',
      period:'',
      comment: ''
    });
  }

  saveOverTimes() {
    var param ={
      collection:this.overtimes
    }
    this.service.saveOvertimeData(param).subscribe(res => {
      this.toastr.success('', 'Record Saved');
      this.overtimes= [{
        id: 1,
        period: '',
        hour: '',
        comment: ''
      }];
    }, err=>{
      this.toastr.error('', 'Record Not Saved !!');
    });
  }

  removeOvertime(i: number) {
    this.overtimes.splice(i, 1);
  }


  logout() {
    this.service.logout();
  }

  ngOnInit() {
    this.service.getReceiptPeriodData().subscribe(res => {
      res.sort(function(a,b){
        return b.periodnumber - a.periodnumber
      });
      for(let index = 0;index< 7;index++){
        let periodFrom = new Date(res[index].periodfrom);
        let periodTo = new Date(res[index].periodto);
        periodFrom.setDate(periodFrom.getDate());
        periodTo.setDate(periodTo.getDate());
        this.overtimePeriods[index] = this.datePipe.transform(periodFrom , "MM-dd-yyyy") +' To ' +
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
  }
}
