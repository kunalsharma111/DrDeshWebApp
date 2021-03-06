import { Component, OnInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { combined, DataTransferService } from '../shared/data-transfer.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { of, from, fromEvent } from 'rxjs';
import { map, first, filter } from 'rxjs/operators'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

declare var $: any
@Component({
  selector: 'app-combinepat',
  templateUrl: './combinepat.component.html',
  styleUrls: ['./combinepat.component.scss']
})
export class CombinepatComponent implements OnInit {
  modalRef: BsModalRef;
  previousRoute: string;
  constructor(public service: DataTransferService, private modalService: BsModalService, public el: ElementRef,
    public toastr: ToastrService, public router: Router) { }
  scale_score = [];
  scale_name = [];
  combined: combined;
  providers: any;
  patientdetail : any;
  facilities: any;
  insurances: any;
  meds: any;
  user;
  role;
  fname;
  metaData;
  todaydate;
  scale_date_text: string;
  scale_score_text;
  scale_form_result;
  data: any = {};
  obj: {
    scale_name: string
    scale_date: string;
    scale_score: number;
    scaledays: string;
  }
  p_id: string;
  masterobj;
  update = false;
  kdate: Date;
  stringdate: string;
  cd: Date;
  kd;
  default_scales = ['PHQ9', 'GDS', "BIMS", "MMSE", "BTQ", 'LEC-5', 'GAD', "BAI"];
  scale60days = ['PHQ9', 'GDS', 'BIMS', 'MMSE', 'GAD', 'BAI', 'BEHAVE-AD', 'RMBC', 'MOCA', 'NPQ', 'ISI', 'AIS', 'PNASS', 'BPRS'];

  ngOnInit() {
    this.previousRoute = this.service.getPreviousUrl();
    this.kdate = new Date();
    this.cd = new Date();
    
    this.kd = this.cd.toISOString().slice(0, 10);
    this.stringdate = this.kdate.toISOString().slice(0, 10);
    this.service.subject.subscribe(res => this.p_id = res);
    if (this.p_id == null || this.p_id == undefined) {
      this.service.router.navigateByUrl('/');
    }
    this.service.getByid(this.p_id).subscribe(res => {
      this.masterobj = res;
      if (res.visit != undefined) {
        this.combined = res.visit;
        this.update = true;
        this.combined.visit = new Date()
        console.log('########################################################################');
        setTimeout(() => {
          var x = this.el.nativeElement.querySelectorAll('.chkbx');
          var status = this.el.nativeElement.querySelectorAll('.medstatus');
          var date = this.el.nativeElement.querySelectorAll('.meddate');
          console.log(this.masterobj.visit.exmeds)
          this.el.nativeElement.querySelector('#cid').value = this.stringdate;
          x.forEach((item, index) => {
            this.masterobj.visit.exmeds.forEach(med => {
              if (med.name == item.value) {
                item.checked = true;
                status[index].value = med.status;
                if (med.status == "Approved")
                  date[index].value = med.date
              }
            })
          });

          var scalechkbx = this.el.nativeElement.querySelectorAll('.scaleschkbx');
          var scalescore = this.el.nativeElement.querySelectorAll('.scale_score');
          var scaledate = this.el.nativeElement.querySelectorAll('.scale_date');
          var scaledayss = this.el.nativeElement.querySelectorAll('.scaledays');
          console.log(this.masterobj.visit.scaleinfo)
          scalechkbx.forEach((item, index) => {
            this.masterobj.visit.scaleinfo.forEach(med => {
              if (med.scale_name == item.value) {
                item.checked = true;
                scalescore[index].value = med.scale_score;
                scaledate[index].value = med.scale_date;
                scaledayss[index].value = med.scaledays;
              }
            })
          });

          var medsyms = this.el.nativeElement.querySelectorAll('.symtoms_meds');
          console.log(this.masterobj.visit.psy_symptoms)
          medsyms.forEach((item) => {
            this.masterobj.visit.meds_symptoms.forEach(med => {
              if (med == item.value) {
                item.checked = true;
                item.value = med;
              }
            })
          });

          var psysyms = this.el.nativeElement.querySelectorAll('.symtoms_psy');
          console.log(this.masterobj.visit.psy_symptoms)
          psysyms.forEach((item) => {
            this.masterobj.visit.psy_symptoms.forEach(med => {
              if (med == item.value) {
                item.checked = true;
                item.value = med;
              }
            })
          });
        }, 500)
      }
      else {
        setTimeout(() => {
          console.log("-----------------------------------------------------------------")
          this.el.nativeElement.querySelector('#cid').value = this.stringdate;
          this.el.nativeElement.querySelectorAll('.scaleschkbx').forEach(scale => {
            // if(this.default_scales.includes(scale)) {
            console.log(scale);
            // }
          })
        }, 500);
      }
      console.log(this.update)
      this.combined.name = res.name;
      this.combined.dob = res.dob;
      this.combined.flag = res.flag;
      // this.el.nativeElement.getElementById('cid').value = this.stringdate;

      // console.log(res.visit.exmeds)
      // this.reset_limited()
    });

    const $button = document.querySelector('#sidebar-toggle');
    const $wrapper = document.querySelector('#wrapper');

    $button.addEventListener('click', (e) => {
      e.preventDefault();
      $wrapper.classList.toggle('toggled');
    });
    this.service.getData()
      .subscribe(
        res => {
          this.user = res;
          this.fname = this.user.fname;
          this.role = this.user.userrole;
          // this.todaydate = new Date();
          // this.user.visit = this.todaydate;
          this.metaData = true;
          console.log(this.user);
        }, err => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            this.service.router.navigateByUrl('/');
          }
        })
    this.resetForm();
    console.log(typeof this.combined.sinsurance)
    this.service.getActiveFacility().subscribe(res => {
      // console.log(res);
      this.facilities = res;
    })
    this.service.getInsurance().subscribe(res => {
      // console.log(res);
      this.insurances = res;
    })
    this.service.getMed().subscribe(res => {
      // console.log(res);
      this.meds = res;
    })
    this.service.getActiveProvider().subscribe(res => {
      this.providers = res;
    })
    console.log(this.update)
  }
  unstable_syms = ['depression', 'anxiety', 'mania', 'psychosis', 'dementia progression and related behaviors', 'delirium and related behaviors', 'pseudobulbar affect']
  type_visits = ['Med-management follow up',  'Psycothreapy', 'Case Management/Psychiatric screenings', 'Care coordination time spent']
  scales = ['Depression', 'PHQ9', 'GDS', 'BDI', 'Cognitive impairment', 'BIMS', 'MMSE', 'Trauma', 'BTQ', 'LEC-5', 'Anxiety', 'GAD', 'BAI', 'PTSD', 'PCL', 'NSESS', 'Bipolar diagnostic', 'BSDS', 'MDQ', 'Dementia with behaviors', 'BEHAVE-AD', 'RMBC', 'Dementia testing', 'MOCA', 'NPQ', 'Insomnia', 'ISQ', 'ISI', 'Suicidal assessment', 'CSSRS', 'BSS', 'Schizophrenia', 'PNASS', 'BPRS', 'Substance use', 'AUDIT', 'DAST', 'FAGERSTORM', 'Misc', 'CNSLS', 'AIMS'];
  med_reasons = ['Patient did not tolerate side effects', 'Patient did not benefit from it', 'Patient cannot afford it', 'Medicine interacts with other medicines', 'Other', 'Not Applicable'];
  genatic_reasons = ['Insurance does not cover it', 'Patient cannot afford copay', 'Patient/POA denied consent', 'Other', 'Not Applicable'];
  med_reasons2 = ['Patient does not need it clinically', 'Patient/POA refused', 'PCP removed the consultation order', 'Other', 'Not Applicable']
  med_reasons3 = ['Pt does not need it clinically', 'Pt/POA refused', 'POA is unable to support', 'Other', 'Not Applicable'];
  psy_reasons = ['Patient does not need it clinically', 'Patient/POA refused', 'Patient is unable to participate because of severe cognitive disorder', 'Patient is unable to participate because of severe speech disorder', 'PCP removed consultation order', 'Other', 'Not Applicable']
  no_see_doc_reasons = ['Patient was not in the facility', 'Patient could not participate in the interview', 'Patient refused to participate in the interview', 'I met the target points for the day', 'Other']
  followup_type = ['Per routine protocol', 'Urgent', 'Very Urgent', 'Date Specific']
  scaleeligible_reasons = ['Patient was not in the Facility', 'Patient could not particpate in the interview', 'Patient refused to particpate in the interview', 'I met the target points for the day', 'Patient not available', 'Other']
  sptime = ['Upto 30 min', 'Upto 45 min', 'Upto 1 Hr', 'More then 1 Hr']
  sday = ['Not Applicable', '3 Months', '6 Months'];
  // firstat : false;
  // reset_limited() {
  //   this.combined
  // }

  resetForm(form?: NgForm) {
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
      savedon : null,
      savedby: '',
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
      np: 'no',
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
      cch: 'no',
      cchconcent: '',
      cchdate: null,
      cchreason: '',
      othercchreason: '',
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
      medfollowup: 'Per routine protocol',
      followupreason: '',
      followupdays: null,
      scaleeligiblereason: 'Not Applicable',
      otherscaleeligiblereason: '',
      flag: null,
      nextvisitdate:null
    }
  }
  one(val: any) {
    console.log(val);
    this.combined.sinsurance = val;
  }
  
  notvalidate: boolean;
  submit(form: NgForm) {
    let nextDate : Date;
    var solution;
    var ff = form.value;
    var what;
        // decrease stopped2 medstopdate started increase decrease2  added addeddate
        this.service.getByid(this.p_id).subscribe(res => {
        solution = JSON.stringify(res);
        this.patientdetail = JSON.parse(solution);
        console.log(this.patientdetail.visit);
        if(this.patientdetail.visit == undefined){
        console.log("first visit");
        if(ff.increase != undefined){
          console.log("7 days 1");
          let dd = ff.visit;
          console.log(dd);
          dd.setHours(dd.getHours() + 24*7);
          nextDate = dd;
          console.log(nextDate);
        }
        else if(ff.decrease != undefined){
          console.log("7 days 2");
          let dd = ff.visit;
          console.log(dd);
          dd.setHours(dd.getHours() + 24*7);
          nextDate = dd;
          console.log(nextDate);
        }
        else if(ff.stopped2 != undefined){
          console.log("7 days 3");
          let dd = ff.visit;
          console.log(dd);
          dd.setHours(dd.getHours() + 24*7);
          nextDate = dd;
          console.log(nextDate);
        }
        else if(ff.medstopdate != undefined){
          console.log("7 days 4");
          let dd = ff.visit;
          console.log(dd);
          dd.setHours(dd.getHours() + 24*7);
          nextDate = dd;
          console.log(nextDate);
        }
        else if(ff.started != undefined){
          console.log("7 days 5");
          let dd = ff.visit;
          console.log(dd);
          dd.setHours(dd.getHours() + 24*7);
          nextDate = dd;
          console.log(nextDate);
        }
        else if(ff.decrease2 != undefined){
          console.log("7 days 6");
          let dd = ff.visit;
          console.log(dd);
          dd.setHours(dd.getHours() + 24*7);
          nextDate = dd;
          console.log(nextDate);
        }
        else if(ff.added != undefined){
          console.log("7 days 7");
          let dd = ff.visit;
          console.log(dd);
          dd.setHours(dd.getHours() + 24*7);
          nextDate = dd;
          console.log(nextDate);
        }
        else if(ff.addeddate != undefined){
          console.log("7 days 8");
          let dd = ff.visit;
          console.log(dd);
          dd.setHours(dd.getHours() + 24*7);
          nextDate = dd;
          console.log(nextDate);
        }
        else{
          console.log("30 days");
          let dd = ff.visit;
          if(dd == null){
            dd = new Date();
          }
          console.log(dd);
          dd.setHours(dd.getHours() + 24*30);
          nextDate = dd;
          console.log(nextDate);
        } 
      }
      else{
        what = this.patientdetail.visit.visit;
        console.log(what);
        const todaysdate = new Date();
        const perdate = new Date(this.patientdetail.visit.nextvisitdate);
        todaysdate.setHours(0,0,0,0);
        perdate.setHours(0,0,0,0);
        if(ff.medfollowup == "Per routine protocol"){
        console.log("per rounding date getting set up");
      if(ff.increase != this.patientdetail.visit.increase){
        console.log("7 days 1");
        let dd = ff.visit;
        console.log(dd);
        dd.setHours(dd.getHours() + 24*7);
        nextDate = dd;
        console.log(nextDate);
      }
      else if(ff.decrease != this.patientdetail.visit.decrease){
        console.log("7 days 2");
        let dd = ff.visit;
        console.log(dd);
        dd.setHours(dd.getHours() + 24*7);
        nextDate = dd;
        console.log(nextDate);
      }
      else if(ff.stopped2 != this.patientdetail.visit.stopped2){
        console.log("7 days 3");
        let dd = ff.visit;
        console.log(dd);
        dd.setHours(dd.getHours() + 24*7);
        nextDate = dd;
        console.log(nextDate);
      }
      else if(ff.medstopdate != this.patientdetail.visit.medstopdate){
        console.log("7 days 4");
        let dd = ff.visit;
        console.log(dd);
        dd.setHours(dd.getHours() + 24*7);
        nextDate = dd;
        console.log(nextDate);
      }
      else if(ff.started != this.patientdetail.visit.started){
        console.log("7 days 5");
        let dd = ff.visit;
        console.log(dd);
        dd.setHours(dd.getHours() + 24*7);
        nextDate = dd;
        console.log(nextDate);
      }
      else if(ff.decrease2 != this.patientdetail.visit.decrease2){
        console.log("7 days 6");
        let dd = ff.visit;
        console.log(dd);
        dd.setHours(dd.getHours() + 24*7);
        nextDate = dd;
        console.log(nextDate);
      }
      else if(ff.added != this.patientdetail.visit.added){
        console.log("7 days 7");
        let dd = ff.visit;
        console.log(dd);
        dd.setHours(dd.getHours() + 24*7);
        nextDate = dd;
        console.log(nextDate);
      }
      else if(ff.addeddate != this.patientdetail.visit.addeddate){
        console.log("7 days 8");
        let dd = ff.visit;
        console.log(dd);
        dd.setHours(dd.getHours() + 24*7);
        nextDate = dd;
        console.log(nextDate);
      }
      else{
        console.log("30 days");
        let dd = ff.visit;
        if(dd == null){
          dd = new Date();
        }
        else{
          dd = new Date(dd);
        }
        console.log(dd);
        dd.setHours(dd.getHours() + 24*30);
        nextDate = dd;
        console.log(nextDate);
      }      
    }
    else{
      console.log("empty it !");
    }
    }
    console.log("yes");
    })

    let summary = '';
    // var getdate = this.nextvisitdate(this.p_id,form);
    if (form.valid) {
      setTimeout(() => {
      if(this.combined.visit == null || this.combined.visit == undefined ){
        this.combined.visit =  new Date();
      }
      // console.log(what);
      // console.log(form.value.visit);
      // console.log(this.combined.visit);
      this.combined.visit = what;
      // console.log(form.value.nextvisitdate);
      form.value.nextvisitdate = nextDate;
      console.log(form.value.nextvisitdate);
      let todays_date = new Date();
      // console.log(todays_date);
      if(form.value.visit == form.value.nextvisitdate){
        // console.log("panga edr hai");
        form.value.visit = todays_date;
        // console.log(form.value.visit);
      }
      else{
        // console.log("dont know");
      }
      var x = this.el.nativeElement.querySelectorAll('.chkbx');
      var status = this.el.nativeElement.querySelectorAll('.medstatus');
      var date = this.el.nativeElement.querySelectorAll('.meddate')
      let medData: any = [];
      let stream$ = from(x);
      this.combined.flag = 1;
      // first 
      stream$.pipe(filter((val: any) => val.checked)).subscribe((res: any) => {
        let meddata: any = {}
        meddata.name = res.value;
        let parstat = status[parseInt(res.id) - 1].value;
        meddata.status = parstat;
        if (parstat == 'Approved')
          meddata.date = date[res.id - 1].value;
        medData.push(meddata);
        console.log("i am complete now first");
      })
      console.log(medData)

      var scalechkbx = this.el.nativeElement.querySelectorAll('.scaleschkbx');
      var scalescore = this.el.nativeElement.querySelectorAll('.scale_score');
      var scaledate = this.el.nativeElement.querySelectorAll('.scale_date');
      var scaledayss = this.el.nativeElement.querySelectorAll('.scaledays');
      console.log(scaledayss);
      let scaleData = [];
      var scalestream$ = from(scalechkbx);
      let p_s = [];
      // second
      scalestream$.pipe(filter((val: any) => val.checked)).subscribe((res: any) => {
        let scaledata: any = {}
        scaledata.scale_name = res.value;
        let parstat = scalescore[parseInt(res.id) - 100].value;
        scaledata.scale_score = parstat;
        if (!parstat) {
          p_s.push(res.value);
        }
        scaledata.scale_date = scaledate[res.id - 100].value;
        scaledata.scaledays = scaledayss[res.id - 100].value;
        console.log(scaledayss);
        scaleData.push(scaledata);
        console.log("i am complete now 2");
      })

      var medsyms = this.el.nativeElement.querySelectorAll('.symtoms_meds');
      let syn_meds = [];
      var med_syn_stream$ = from(medsyms);
      // third
      med_syn_stream$.pipe(filter((val: any) => val.checked)).subscribe((res: any) => {
        syn_meds.push(res.value);
        console.log("i am complete now 3");
      })

      var psysyms = this.el.nativeElement.querySelectorAll('.symtoms_psy');
      let syn_psy = [];
      var psy_syn_stream$ = from(psysyms);
      console.log(psysyms)
      // fourth
      psy_syn_stream$.pipe(filter((val: any) => val.checked)).subscribe((res: any) => {
        syn_psy.push(res.value);
        console.log(res)
        console.log("i am complete now 4");
      })
      var psy_psyms = { psy_symptoms: syn_psy }
      var med_syms = { meds_symptoms: syn_meds }
      var meds = { exmeds: medData }
      var scaleinfo = { scaleinfo: scaleData }
      // fifth
      summary += `Date: ${new Date(this.combined.visit).toString().slice(0,15)}  |  Provider name: ${form.value.provider} . | `
      if (form.value.generictest == 'no') {
        if (form.value.geneticreason) {
          summary +=`Reasons for discontinuations from Genetic testing: 
          ${(form.value.geneticreason=='Other'?form.value.othergeneticreason:form.value.geneticreason)} . | `
        }
      }
      if (form.value.generictest == 'yes') {
        summary += `Genetic testing was ordered to guide us find more appropriate medicine for this patient. | `
      }
      if (form.value.capacity == 'no') {
        summary += `Medical decision-making capacity was performed per requested by the facility. Pt does not have capacity .| `
      }
      if (form.value.capacity == 'yes') {
        summary += `Medical decision-making capacity was performed per requested by the facility. Pt has capacity to make medical decision . | `
      }
      if (form.value.medmanage == 'no') {
        if (form.value.medreason2 != 'Other')
          summary += ` Pt was deemed not eligible for med management because. ${form.value.medreason2} . | `;
        else {
          summary += ` Pt was deemed not eligible for med management because. ${form.value.othermedreason2} . | `;
        }
      }
      if (form.value.psythreapy == 'no') {
        if (form.value.psyreason != 'Other')
          summary += ` Pt was deemed not eligible for Psychotherapy because. ${form.value.psyreason} . | `;
        else {
          summary += ` Pt was deemed not eligible for Psychotherapy because. ${form.value.otherpsyreason} . | `;
        }
      }
      if (form.value.psyscreen == 'no') {
        if (form.value.psyscreenreason != 'Other' && form.value.psyscreen != '')
          summary += ` Pt was deemed not eligible for Psychotherapy Screening because. ${form.value.psyreason} . | `;
        else {
          summary += ` Pt was deemed not eligible for Psychotherapy Screening because. ${form.value.otherpsyscreenreason} . | `;
        }
      }
      if (form.value.bhi == 'no') {
        if (form.value.bhireason)
          summary += ` Reasons for discontinuations from BHI ${(form.value.bhireason=='Other'?form.value.otherbhireason:form.value.bhireason)} . | `;
      }
      if (form.value.ccm == 'no') {
        if (form.value.ccmreason)
          summary += ` Reasons for discontinuations from CCM ${(form.value.ccmreason=='Other'?form.value.otherccmreason:form.value.ccmreason)} . | `;
      }
      if (form.value.bhi == 'yes') {
        summary += `Pt was admitted to BHI program as ${form.value.bhiconcent} consent was obtained. | `
      }
      if (form.value.ccm == 'yes') {
        summary += `Pt was admitted to CCM program as ${form.value.ccmconcent} consent was obtained. | `
      }
      if (form.value.noseedocreason == 'no') {
        if (form.value.noseedocreason)
        summary += `Attempted to see the patient for med-management but could not see because ${(form.value.noseedocreason=='Other'?form.value.othernoseedocreason:form.value.noseedocreason)} . | `
      }
      if (form.value.seedoc == 'stable') {
        summary += `Pt is stable. Considered GDR but could not perform as pt would become unstable . | `
      }
      if (form.value.yesstable == 'no') {
        summary += `Pt is stable. GDR was perfomed . | `
        if (form.value.increase) {
          summary += `Increased ${form.value.increase} . | `
        }
        if (form.value.decrease) {
          summary += `Decreased ${form.value.decrease} . | `
        }
        if (form.value.medstopdate) {
          summary += `Added a stop date to medications ${form.value.medstopdate} . | `
        }
      }
      if (form.value.seedoc == 'unstable') {
        summary += `Pt is unstable and has symptoms of ${JSON.stringify(med_syms)} | . Changes to medication ${(form.value.nostable == 'no') ? 'yes' : 'no'} . | `
        if (form.value.nostable == 'no') {
          if (form.value.started) {
            summary += `Started ${form.value.started} . | `
          }
          if (form.value.increase) {
            summary += `Increased ${form.value.increase} . | `
          } form.value.ccmreason
          if (form.value.decrease2) {
            summary += `Decreased ${form.value.decrease2} . | `
          }
          if (form.value.stopped2) {
            summary += `Stopped ${form.value.stopped2} . | `
          }
          if (form.value.addeddate) {
            summary += `Decreased ${form.value.addeddate} . | `
          }
        }
      }
      if (form.value.psynoseedocreason != '' && form.value.psynoseedocreason) {
        summary += `Attempted to see the patient for psychotherapy but could not see because ${form.value.psynoseedocreason} . | `
      }
      if (form.value.seepsy == 'unstable') {
        summary += `Pt is unstable and has symptoms of ${JSON.stringify(psy_psyms)} . | `
      }
      if (p_s.length) {
        summary += JSON.stringify(p_s);
      }
      if (form.value.medfollowup == 'Urgent' || form.value.medfollowup == 'Very Urgent') {
        summary += `Patient condition is ${form.value.medfollowup} | `
      }
      console.log("i am complete now 5");
      let formdata = form.value;
      // formdata.visit = this.combined.visit;
      if (formdata.followup == "") {
        formdata.followup = null;
      }
      formdata.summary = summary;
      let masterptdata = { ...meds, ...med_syms, ...psy_psyms, ...scaleinfo, ...formdata }
      console.log(masterptdata)
      console.log("savinggg");

      this.service.submitMasterPatientData(masterptdata).subscribe(res=>{
        console.log(res);
      });
      if (this.previousRoute == '/patient') {
        this.router.navigate(['/patient']);
      } else {
        this.gotoreport();
      }
      this.toastr.success('', 'Patient Record Updated Successfully');
    }, 3000)
    }
    else {
      this.notvalidate = true;
    }
    
  
    // this.resetForm();
  }
  app() {
    setTimeout(() => {
      console.log("please call me");
      $("#myModalap").modal("show");
    }, 100)
  }
  getcurrentDate(): string {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth().toString().length == 1 ? "0" + d.getMonth().toString() : d.getMonth().toString();
    let date = d.getDate().toString().length == 1 ? "0" + d.getMonth().toString() : d.getMonth().toString();
    return `${year}-${month}-${date}`
  }
  logout() {
    this.service.logout()
  }
  ap() {
    this.service.topatient('yes');
  }
  af() {
    this.service.toprovider('yes');
  }
  ai() {
    this.service.toinsurance('yes');
  }
  ae() {
    this.service.toexpensive('yes');
  }
  gotoreport() {
    this.service.toreport('yes');
  }
  fill(e) {
    if (e == "yes" && this.combined.flag == 0) {
      setTimeout(() => {
        this.el.nativeElement.querySelectorAll('.scaleschkbx').forEach(res => {
          if (this.default_scales.includes(res.value)) {
            res.checked = 1;
          }
        })
      }, 1000)
      // setTimeout(()=>{
      //   this.masterobj.visit.scaleinfo.forEach(res => {
      //     if (this.scale60days.includes(res.value)) {
      //         res.scaledays = "60 Days"
      //     }
      //   })
      // },1000)
    }
  }

}
