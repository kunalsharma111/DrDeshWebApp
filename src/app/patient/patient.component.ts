import { Component, OnInit, ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
declare var $: any;
import { Patient, DataTransferService, PatientRound2, combined } from '../shared/data-transfer.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { from, fromEvent, pipe } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  // commentbox="no";
  // @ViewChild('gate',{static:true}) sc:ElementRef;
  modalRef: BsModalRef;
  constructor(private datePipe: DatePipe, public service: DataTransferService, public toastr: ToastrService, public el: ElementRef, public renderer: Renderer2, private modalService: BsModalService) { }

  @ViewChild('search', { static: true }) search: ElementRef;
  metaData = true;//false kr dena jo bhi dekha ise
  c_id;
  fname = '';
  searchString: string = '';
  cd: Date;
  kd;
  dob;
  role;

  ngOnInit() {
    console.log(this.search)
    fromEvent(this.search.nativeElement, 'input')
      .pipe(map((event: any) => event.target.value), debounceTime(500), distinctUntilChanged())
      .subscribe(val => {
        // console.log(val)
        const params = new HttpParams().set('name', val);
        console.log(params)
        this.service.http.get(this.service.url27,{params}).subscribe(fin=>{
          // console.log(fin);
          this.patients = fin;
        })
      })
    var MMddyyyy = this.datePipe.transform(new Date(), "MM-dd-yyyy");
    console.log(MMddyyyy);
    this.resetStuff();
    this.cd = new Date();
    this.kd = this.cd.toISOString().slice(0, 10);
    this.service.cc1$
      .subscribe(
        message => {
          if (message === 'yes') {
            console.log("patient bef");
            this.app();
            console.log("patienty")
          }
        }
      )
    // this.service.getPatientData().subscribe(res => {
    //   this.patients = res;
    // })
    this.service.getData().subscribe(res => {
      let user = res;
      this.fname = user.fname;
      this.role = user.userrole;
      console.log(this.fname)
      this.metaData = true;
    }, err => {
      // console.log(err);
      if (err instanceof HttpErrorResponse) {
        this.service.router.navigateByUrl('/');
      }
    })
    const $button = document.querySelector('#sidebar-toggle');
    const $wrapper = document.querySelector('#wrapper');

    $button.addEventListener('click', (e) => {
      e.preventDefault();
      $wrapper.classList.toggle('toggled');
    });

  }
  combined: combined;
  resetStuff(form?: NgForm) {
    if (form != null) {
      form.resetForm()
    }
    this.combined = {
      id: null,
      visit: null,
      name: '',
      dob: null,
      patientcreatedon : null,
      patientcreatedby:'',
      savedon:null,
      savedby:'',
      careconditiontimespent: '',
      seedoc: '',
      noseedocreason: '',
      othernoseedocreason: '',
      psynoseedocreason: '',
      otherpsynoseedocreason: '',
      stable: '',
      gdrstable: '',
      psythreapy: 'yes',
      reasonpsy: '',
      psyscreen: 'yes',
      psyscreenreason: '',
      labs: 'no',
      labname: '',
      medmanage: 'yes',
      reasonmedmanage: '',
      followup: '',
      patientcondition: '',
      unstable_text: '',
      started: '',
      increase: '',
      decrease: '',
      stopped: '',
      decrease2: '',
      stopped2: '',
      medstopdate: null,
      newappointmentrecord: '',
      added: '',
      addeddate: '',
      yesstable: '',
      nostable: '',
      verystable: '',
      yesstablepsy: '',
      nostablepsy: '',
      verystablepsy: '',
      psymanage: 'no',
      seepsy: '',
      noseepsyreason: '',
      theligible: '',
      pinsurance: '',
      sinsurance: '',
      facility: '',
      provider: '',
      room: '',
      medication: 'no',
      medicationName: '',
      generictest: 'no',
      pcp: 'no',
      genericresult: '',
      docterupload: '',
      demographicsheetuploaded: 'no',
      capacityassesment: 'no',
      capacity: 'no',
      bhi: 'no',
      ccm: 'no',
      bhiconcent: '',
      ccmconcent: '',
      medmanage2: 'no',
      scaleeligible: 'no',
      scale: '',
      comment: '',
      service_type: '',
      frequentlypsychotherapy: null,
      typevisit: '',
      medreason: '',
      othermedreason: '',
      geneticreason: '',
      othergeneticreason: '',
      medreason2: '',
      othermedreason2: '',
      psyreason: '',
      otherpsyreason: '',
      otherpsyscreenreason: '',
      bhireason: '',
      otherbhireason: '',
      ccmreason: '',
      otherccmreason: '',
      homeclinic: 'no',
      homeclinicconcent: '',
      homeclinicreason: '',
      otherhomeclinicreason: '',
      masterstable: 'stable',
      masterstablereason: '',
      typevisitreason: '',
      thtime: null,
      consult: 'no',
      conpsy: '',
      conmed: '',
      conscr: '',
      conpsyreason: '',
      conmedreason: '',
      conscrreason: '',
      conpsyname: '',
      currentmeds: '',
      np: 'no',
      cch: 'no',
      cchconcent: '',
      cchdate: null,
      cchreason: '',
      othercchreason: '',
      medfollowup: '',
      followupreason: '',
      followupdays: null,
      scaleeligiblereason: '',
      otherscaleeligiblereason: '',
      flag: 0,
      nextvisitdate:null
    }
  }

  logout() {
    this.service.logout();
  }
  submit(form: NgForm) {
    res:0;
  this.service.sendBaseData(form.value).subscribe(res => {
    console.log(res)
  }); 

  //  this.toastr.success('', 'Patient Added Successfully');
    $("#myModal").modal("hide");
    this.resetStuff();
  }
  patients;
  searchDate;
  app() {
    setTimeout(() => {
      $("#myModal").modal("show");
    }, 100)
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
