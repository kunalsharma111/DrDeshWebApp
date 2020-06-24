import { Component, OnInit, Renderer2, ViewChild, ElementRef, PLATFORM_ID, Inject, Provider } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTransferService, PatientRound2, Facility } from '../shared/data-transfer.service';
import { HttpErrorResponse } from '@angular/common/http';
declare var $: any
import 'jspdf-autotable'
// import { isPlatformBrowser } from '@angular/common';
import * as xlsx from 'xlsx';
import * as logoFile from '../img/logo.js';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  role;
  isBrowser;
  constructor(public service: DataTransferService, public renderer: Renderer2) {
    // this.isBrowser = isPlatformBrowser(platformId);
  }
  @ViewChild('ball', { static: true }) ball;
  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild('design', { static: false }) design: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('like', { static: false }) like: ElementRef;
  round2patients: any;
  report: {
    insurance: string;
    provider: string;
    date: Date;
  }

  fname: string;
  metaData = false;
  patients: any;
  providers:Provider;
  facilities:Facility;
  output:any;
  providerreportoutput: any = [];
  facilityreportoutput: any = [];
  proFacReportInput : any = [];

  logout() {
    this.service.logout();
  }


  ngOnInit() {
    this.service.cc6$
    .subscribe(
      message => {
        if (message === 'yes') {
          this.open();
        }
      }
    )
    this.resetform();
    const $button = document.querySelector('#sidebar-toggle');
    const $wrapper = document.querySelector('#wrapper');

    $button.addEventListener('click', (e) => {
      e.preventDefault();
      $wrapper.classList.toggle('toggled');
    });
    this.service.getData()
      .subscribe(
        res => {
          let user = res;
          this.fname = user.fname;
          this.role = user.userrole;
          this.metaData = true;
        }, err => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            this.service.router.navigateByUrl('/');
          }
        })
    this.service.getProvider().subscribe(res => {
      this.providers = res;
      console.log(this.providers);
    });
    this.service.getFacility().subscribe(res => {
      this.facilities = res;
    })
  }

  repo:{
    facility:string,
    provider:string,
    date:string
  }
  repo1: any = {  }
  repo2 :any ={ }
  showit = true;
  gammma = false;
  showit2 = true;
  showit3 = true;
  showit4 = true;
  gammma2= false;
  gammma3 = false;
  gammma4 = false;
  fn;
  pn;
  dd;
  postData;
  nodata = false;
  nodata2 = false;
  nodata3 = false;
  nodata4 = false;


  // prerounding report
  notvalidate:boolean;
  submit(form) {
    if (form.valid) {
    this.nodata = false;
    this.showit = false;
    localStorage.setItem("facility",form.value.facility);
    localStorage.setItem("provider",form.value.provider);
    localStorage.setItem("date",form.value.date);
    console.log(form.value);
    this.service.findprerecords(form.value).subscribe(res =>{
      this.output = res;
      console.log(this.output);
      if(this.output.length == []){
        console.log("empty");
        this.nodata = true;
        this.showit = true;
      }
      else{
      this.gammma =true;
      this.showit = false;
      }
    })
    this.fn = this.repo.facility;
    this.pn = this.repo.provider;
    this.dd = this.repo.date;
    this.resetform();
  }
  else{
    this.notvalidate = true;
  }
}

  // post rounding report
  notvalidate1:boolean;
  submit_post(form) {
    if(form.valid){
    this.nodata2 = false;
    this.showit2 = false;
    this.service.getpostroundingreport(form.value).subscribe(res=>{
      this.postData = res;
      console.log(this.postData);
      if(this.postData.length == []){
        console.log("empty");
        this.nodata2 = true;
        this.showit2 = true;
        this.repo = {
          facility: '',
          provider: '',
          date: null
        }
      }
      else{
      this.gammma2 =true;
      this.showit2 = false;
      }
    });
    this.fn = this.repo.facility;
    this.pn = this.repo.provider;
    this.dd = this.repo.date;
    this.resetform();
  }
  else{
    this.notvalidate1 = true;
  }
}

  // provider report
  notvalidate2 : Boolean;
  submitproviderreport(form){
    this.proFacReportInput = form.value;
    console.log(form.value);
    if(form.valid){
    this.nodata3 = false;
    this.showit3 = false;
    this.service.findproviderreport(form.value).subscribe(res =>{
      this.providerreportoutput = Array.of(res);
      console.log(this.providerreportoutput[0].length);
      // var total:{
      //   no_of_patients_seen :0
      // }
      for(let kp=0;kp<this.providerreportoutput[0].length;kp++){
        console.log(this.providerreportoutput[0][kp]);
        // total.no_of_patients_seen +=
      }
      console.log(this.providerreportoutput[0][0]);
      if(this.providerreportoutput[0] == "no"){
        this.nodata3 = true;
        this.showit3 = true;
        this.gammma3 = false;
        this.repo1 = {
          provider1: '',
          fromdate:'',
          todate:''
        };
      }
      else{
      this.gammma3 = true;
      this.showit3 = false;
      }
    })
  }
  else{
    this.notvalidate2 = true;
  }
}

  // facility report
  notvalidate3 : Boolean;
  submitfacilityreport(form){
    this.proFacReportInput = form.value;
    console.log(form.value);
    if(form.valid){
    this.nodata4 = false;
    this.showit4 = false;
    this.service.findfacilityreport(form.value).subscribe(res =>{
      console.log(this.facilityreportoutput.length);
      this.facilityreportoutput = Array.of(res);
      console.log(this.facilityreportoutput);
      console.log(this.facilityreportoutput[0][0]);
      if(this.facilityreportoutput[0] == "no"){
        this.nodata4 = true;
        this.showit4 = true;
        this.gammma4 = false;
        this.repo2 = {
          facility1: '',
          fromdate1:'',
          todate1:''
        };
      }
      else{
      this.gammma4 = true;
      this.showit4 = false;
      }
    })
  }
  else{
    this.notvalidate3 = true;
  }
  }


  // clear all result without reloading page
  re1(){
    this.showit = true;
    this.gammma = false;

    this.repo = {
      facility: '',
      provider: '',
      date: null
    }
    this.nodata = false;
  }
  re2(){
    this.showit2 = true;
    this.gammma2 = false;
    this.nodata2 = false;
    this.repo = {
      facility: '',
      provider: '',
      date: null
    }

  }
  re3(){
    this.showit3 = true;
    this.gammma3 = false;
    this.nodata3 = false;
    this.repo1 = {

    }
    this.providerreportoutput=[];
  }
  re4(){
    this.showit4 = true;
    this.gammma4 = false;
    this.nodata4 = false;
    this.repo2 = {

    }
    this.facilityreportoutput=[];

  }
  // navbar navigation
  ap() {
    this.service.topatient('yes');
  }
  app() {
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
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  @ViewChild('epltablee', { static: false }) epltablee: ElementRef;
// exxport to excel
  exportToExcel(fileName, reportName) {
    let reportData = [];
    let inputFacilityProvider;
    let inputFromDate;
    let inputToDate;
    let provideFacility;
    let labelFacilityProvider;
    if(fileName !== 'facility_performance_report.xlsx') {
      reportData = this.providerreportoutput ;
      inputFacilityProvider = this.proFacReportInput.provider1;
      inputFromDate = this.proFacReportInput.fromdate;
      inputToDate = this.proFacReportInput.todate;
      labelFacilityProvider = 'Provider Name';
    }else {
      reportData = this.facilityreportoutput ;
      inputFacilityProvider = this.proFacReportInput.facility1;
      inputFromDate = this.proFacReportInput.fromdate1;
      inputToDate = this.proFacReportInput.todate1;
      labelFacilityProvider = 'Facility Name';
    }

    const workbooke = new Excel.Workbook();
    const worksheet = workbooke.addWorksheet(reportName);
    const reportHeadingColumnForProvider = ['', 'Facility', 'No. of patients Seen', 'Points seen', 'Medicines lowered', 'Medicines continued but added stop date', 'Medicines stopped',
      'GDR', 'Medicines Added', 'Medicines increased', 'Medicines Added with stop date',
      'Scales Performed', 'PHQ9', '', 'GDS', '', 'BDI', '', 'Depression', '',
      'Cognitive impairment', '', 'BIMS', '',
      'MMSE', '', 'Trauma', '', 'BTQ', '', 'LEC-5', '', 'Anxiety', '', 'GAD', '', 'BAI', '', 'PTSD', '',
      'PCL', '', 'NSESS', '', 'Bipolar diagnostic', '', 'BSDS', '', 'MDQ', '', 'Dementia with behaviors', '',
      'BEHAVE-AD', '', 'RMBC', '', 'Dementia testing', '', 'MOCA', '', 'NPQ', '', 'Insomnia', '', 'ISQ', '',
      'ISI', '', 'Suicidal assessment', '', 'CSSRS', '', 'BSS', '', 'Schizophrenia', '', 'PNASS', '',
      'BPRS', '', 'Substance use', '', 'AUDIT', '', 'DAST', '', 'FAGERSTORM', '', 'Misc', '', 'CNSLS', '', 'AIMS', ''];

    const reportHeadingColumnForFacility = ['', 'Provider', 'No. of patients Seen', 'Medicines lowered', 'Medicines continued but added stop date', 'Medicines stopped',
      'GDR', 'Medicines Added', 'Medicines increased', 'Medicines Added with stop date',
      'Scales Performed', 'PHQ9', '', 'GDS', '', 'BDI', ''
      , 'Depression', '',
      'Cognitive impairment', '', 'BIMS', '',
      'MMSE', '', 'Trauma', '', 'BTQ', '', 'LEC-5', '', 'Anxiety', '', 'GAD', '', 'BAI', '', 'PTSD', '',
      'PCL', '', 'NSESS', '', 'Bipolar diagnostic', '', 'BSDS', '', 'MDQ', '', 'Dementia with behaviors', '',
      'BEHAVE-AD', '', 'RMBC', '', 'Dementia testing', '', 'MOCA', '', 'NPQ', '', 'Insomnia', '', 'ISQ', '',
      'ISI', '', 'Suicidal assessment', '', 'CSSRS', '', 'BSS', '', 'Schizophrenia', '', 'PNASS', '',
      'BPRS', '', 'Substance use', '', 'AUDIT', '', 'DAST', '', 'FAGERSTORM', '', 'Misc', '', 'CNSLS', '', 'AIMS', ''];

    worksheet.addRow([]);

    var reportLogo = workbooke.addImage({
      base64: logoFile.logoBase64,
      extension: 'png',
    });

    worksheet.addImage(reportLogo, {
      tl: { col: 2.5, row: 0 },
      br: { col: 3.5, row: 4.5 }
    });

    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    const address = worksheet.addRow(['', 'Psychiatry Care \n10840 N US Highway 301 \nOxford FL 34484 Oxford FL 34484 \nOffice:(352) 445-1200 \nFax: (888) 248-4348',]);

    address.eachCell((cell, number) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    worksheet.addRow(['', '']);
    worksheet.addRow(['', '']);
    worksheet.addRow(['', '']);
    worksheet.addRow(['', '']);
    worksheet.mergeCells(['B6:D10']);
    const reportNameHeading = worksheet.addRow(['', reportName]);
    worksheet.mergeCells(['B11:D11']);
    reportNameHeading.font = {size: 16, underline: 'double', bold: true };

    reportNameHeading.eachCell((cell, number) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
    console.log("this.proFacReportInput", this.proFacReportInput)
    const facilityRow = worksheet.addRow(['', labelFacilityProvider, inputFacilityProvider]);
    const fromDate = worksheet.addRow(['', 'From Date', inputFromDate]);
    const toDate = worksheet.addRow(['', 'To Date', inputToDate]);

    facilityRow.eachCell((cell, number) => {
      if (number == 1) return;
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    fromDate.eachCell((cell, number) => {
      if (number == 1) return;
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    toDate.eachCell((cell, number) => {
      if (number == 1) return;
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    worksheet.addRow([]);
    let headerRow;
    if(fileName !== 'facility_performance_report.xlsx') {
      headerRow = worksheet.addRow(reportHeadingColumnForProvider);
      worksheet.mergeCells(['M16:N16']);
      worksheet.mergeCells(['O16:P16']);
      worksheet.mergeCells(['Q16:R16']);
      worksheet.mergeCells(['S16:T16']);
      worksheet.mergeCells(['U16:V16']);
      worksheet.mergeCells(['W16:X16']);
      worksheet.mergeCells(['Y16:Z16']);
      worksheet.mergeCells(['AA16:AB16']);
      worksheet.mergeCells(['AC16:AD16']);
      worksheet.mergeCells(['AE16:AF16']);
      worksheet.mergeCells(['AG16:AH16']);
      worksheet.mergeCells(['AI16:AJ16']);
      worksheet.mergeCells(['AK16:AL16']);
      worksheet.mergeCells(['AM16:AN16']);
      worksheet.mergeCells(['AO16:AP16']);
      worksheet.mergeCells(['AQ16:AR16']);
      worksheet.mergeCells(['AS16:AT16']);
      worksheet.mergeCells(['AU16:AV16']);
      worksheet.mergeCells(['AW16:AX16']);
      worksheet.mergeCells(['AY16:AZ16']);
      worksheet.mergeCells(['BA16:BB16']);
      worksheet.mergeCells(['BC16:BD16']);
      worksheet.mergeCells(['BE16:BF16']);
      worksheet.mergeCells(['BG16:BH16']);
      worksheet.mergeCells(['BI16:BJ16']);
      worksheet.mergeCells(['BK16:BL16']);
      worksheet.mergeCells(['BM16:BN16']);
      worksheet.mergeCells(['BO16:BP16']);
      worksheet.mergeCells(['BQ16:BR16']);
      worksheet.mergeCells(['BS16:BT16']);
      worksheet.mergeCells(['BU16:BV16']);
      worksheet.mergeCells(['BW16:BX16']);
      worksheet.mergeCells(['BY16:BZ16']);
      worksheet.mergeCells(['CA16:CB16']);
      worksheet.mergeCells(['CC16:CD16']);
      worksheet.mergeCells(['CE16:CF16']);
      worksheet.mergeCells(['CG16:CH16']);
      worksheet.mergeCells(['CI16:CJ16']);
      worksheet.mergeCells(['CK16:CL16']);
      worksheet.mergeCells(['CM16:CN16']);
      worksheet.mergeCells(['CO16:CP16']);
    }else {
      headerRow = worksheet.addRow(reportHeadingColumnForFacility);
      worksheet.mergeCells(['L16:M16']);
      worksheet.mergeCells(['N16:O16']);
      worksheet.mergeCells(['P16:Q16']);
      worksheet.mergeCells(['R16:S16']);
      worksheet.mergeCells(['T16:U16']);
      worksheet.mergeCells(['V16:W16']);
      worksheet.mergeCells(['X16:Y16']);
      worksheet.mergeCells(['Z16:AA16']);
      worksheet.mergeCells(['AB16:AC16']);
      worksheet.mergeCells(['AD16:AE16']);
      worksheet.mergeCells(['AF16:AG16']);
      worksheet.mergeCells(['AH16:AI16']);
      worksheet.mergeCells(['AJ16:AK16']);
      worksheet.mergeCells(['AL16:AM16']);
      worksheet.mergeCells(['AN16:AO16']);
      worksheet.mergeCells(['AP16:AQ16']);
      worksheet.mergeCells(['AR16:AS16']);
      worksheet.mergeCells(['AT16:AU16']);
      worksheet.mergeCells(['AV16:AW16']);
      worksheet.mergeCells(['AX16:AY16']);
      worksheet.mergeCells(['AZ16:BA16']);
      worksheet.mergeCells(['BB16:BC16']);

      worksheet.mergeCells(['BD16:BE16']);
      worksheet.mergeCells(['BF16:BG16']);
      worksheet.mergeCells(['BH16:BI16']);
      worksheet.mergeCells(['BJ16:BK16']);
      worksheet.mergeCells(['BL16:BM16']);
      worksheet.mergeCells(['BN16:BO16']);
      worksheet.mergeCells(['BP16:BQ16']);
      worksheet.mergeCells(['BR16:BS16']);
      worksheet.mergeCells(['BT16:BU16']);
      worksheet.mergeCells(['BV16:BW16']);
      worksheet.mergeCells(['BX16:BY16']);
      worksheet.mergeCells(['BZ16:CA16']);
      worksheet.mergeCells(['CB16:CC16']);
      worksheet.mergeCells(['CD16:CE16']);
      worksheet.mergeCells(['CF16:CG16']);
      worksheet.mergeCells(['CH16:CI16']);
      worksheet.mergeCells(['CJ16:CK16']);
      worksheet.mergeCells(['CL16:CM16']);
      worksheet.mergeCells(['CN16:CO16']);
    }

    headerRow.eachCell((cell, number) => {
      this.designSheet(cell, number, fileName, reportHeadingColumnForProvider, reportHeadingColumnForFacility, 1);
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });


    console.log("reportData", reportData);
    let i = 0;
    let lastRowData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    reportData[0].forEach(d => {
      if(i == 0) {
        let headerSecond: any;
        if(fileName !== 'facility_performance_report.xlsx'){
          headerSecond = worksheet.addRow(['', '' , '' , '', '', '', '', '', '', '', '', '', 'Count', 'Average Score', 'Count', 'Average Score',
          'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score']);
        } else{
          headerSecond = worksheet.addRow(['', '' , '' , '', '', '', '', '', '', '', '', 'Count', 'Average Score', 'Count', 'Average Score', 'Count',
          'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score', 'Count', 'Average Score'
          , 'Count', 'Average Score', 'Count', 'Average Score']);
        }
        headerSecond.eachCell((cell, number) => {
          this.designSheet(cell, number, fileName, reportHeadingColumnForProvider, reportHeadingColumnForFacility, 2);
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        });
        i++;
      }
      if(fileName !== 'facility_performance_report.xlsx'){
        lastRowData[0] = lastRowData[0] + d.no_of_patients_seen;
        lastRowData[1] = lastRowData[1] + d.points_seen;
        lastRowData[2] = lastRowData[2] + d.meds_lowered;
        lastRowData[3] = lastRowData[3] + d.meds_continued_but_added_stop_date;
        lastRowData[4] = lastRowData[4] + d.meds_stopped;
        lastRowData[5] = lastRowData[5] + d.meds_lowered + d.meds_continued_but_added_stop_date +  d.meds_stopped
        lastRowData[6] = lastRowData[6] + d.meds_added;
        lastRowData[7] = lastRowData[7] + d.meds_increased;
        lastRowData[8] = lastRowData[8] + d.meds_added_with_stop_date;
        lastRowData[9] = lastRowData[9] + d.scales_performed;
        lastRowData[10] = lastRowData[10] + d.scales_details[0].count;
        lastRowData[11] = lastRowData[11] + d.scales_details[0].average_score;
        lastRowData[12] = lastRowData[12] + d.scales_details[1].count;
        lastRowData[13] = lastRowData[13] + d.scales_details[1].average_score;
        lastRowData[14] = lastRowData[14] + d.scales_details[2].count;
        lastRowData[15] = lastRowData[15] + d.scales_details[2].average_score;
        const data = worksheet.addRow(['', d.facility_name, d.no_of_patients_seen, d.points_seen,
          d.meds_lowered, d.meds_continued_but_added_stop_date, d.meds_stopped, d.meds_lowered + d.meds_continued_but_added_stop_date +  d.meds_stopped ,
          d.meds_added, d.meds_increased, d.meds_added_with_stop_date,
          d.scales_performed, d.scales_details[0].count, d.scales_details[0].average_score, d.scales_details[1].count, d.scales_details[1].average_score, d.scales_details[2].count, d.scales_details[2].average_score]);

        data.eachCell((cell, number) => {
          this.designSheet(cell, number, fileName, reportHeadingColumnForProvider, reportHeadingColumnForFacility, 2);
          if(number >= 3){
            cell.alignment = { vertical: 'middle', horizontal: 'center'};
          }
        });

      }else {
        lastRowData[0] = lastRowData[0] + d.no_of_patients_seen;
        lastRowData[1] = lastRowData[1] + d.points_seen;
        lastRowData[2] = lastRowData[2] + d.meds_lowered;
        lastRowData[3] = lastRowData[3] + d.meds_continued_but_added_stop_date;
        lastRowData[4] = lastRowData[4] + d.meds_stopped;
        lastRowData[5] = lastRowData[5] + d.meds_lowered + d.meds_continued_but_added_stop_date +  d.meds_stopped
        lastRowData[6] = lastRowData[6] + d.meds_added;
        lastRowData[7] = lastRowData[7] + d.meds_increased;
        lastRowData[8] = lastRowData[8] + d.meds_added_with_stop_date;
        lastRowData[9] = lastRowData[9] + d.scales_performed;
        lastRowData[10] = lastRowData[10] + d.scales_details[0].count;
        lastRowData[11] = lastRowData[11] + d.scales_details[0].average_score;
        lastRowData[12] = lastRowData[12] + d.scales_details[1].count;
        lastRowData[13] = lastRowData[13] + d.scales_details[1].average_score;
        lastRowData[14] = lastRowData[14] + d.scales_details[2].count;
        lastRowData[15] = lastRowData[15] + d.scales_details[2].average_score;

        const data = worksheet.addRow(['', d.provider_name, d.no_of_patients_seen,
          d.meds_lowered, d.meds_continued_but_added_stop_date, d.meds_stopped, d.meds_lowered + d.meds_continued_but_added_stop_date + d.meds_stopped,
          d.meds_added, d.meds_increased, d.meds_added_with_stop_date,
          d.scales_performed, d.scales_details[0].count, d.scales_details[0].average_score, d.scales_details[1].count, d.scales_details[1].average_score, d.scales_details[2].count, d.scales_details[2].average_score]);
        data.eachCell((cell, number) => {
          this.designSheet(cell, number, fileName, reportHeadingColumnForProvider, reportHeadingColumnForFacility, 2);
          if(number >= 3){
            cell.alignment = { vertical: 'middle', horizontal: 'center'};
          }
        });
      }
    });

    for(let addBlankRow = 0; addBlankRow < 2; addBlankRow++){
      let blankRow;
      if(fileName !== 'facility_performance_report.xlsx'){
        blankRow = worksheet.addRow(['', '' , '' , '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', '']);
      } else{
        blankRow = worksheet.addRow(['', '' , '' , '', '', '', '', '', '', '', '', '', '', '', '', '',
        '']);
      }
      blankRow.eachCell((cell, number) => {
        this.designSheet(cell, number, fileName, reportHeadingColumnForProvider, reportHeadingColumnForFacility, 2);
      });
    }
    let lastRow;
    if(fileName !== 'facility_performance_report.xlsx'){
      lastRow = worksheet.addRow(['', 'Total' , lastRowData[0] , lastRowData[1], lastRowData[2], lastRowData[3], lastRowData[4], lastRowData[5], lastRowData[6], lastRowData[7], lastRowData[8], lastRowData[9],
      lastRowData[10], lastRowData[11], lastRowData[12], lastRowData[13],
      lastRowData[14], lastRowData[15], , lastRowData[16]]);
    }
    if(fileName == 'facility_performance_report.xlsx'){
      lastRow = worksheet.addRow(['', 'Total' , lastRowData[0], lastRowData[2],  lastRowData[3], lastRowData[4], lastRowData[5], lastRowData[6], lastRowData[7], lastRowData[8], lastRowData[9],
      lastRowData[10], lastRowData[11], lastRowData[12], lastRowData[13],
      lastRowData[14], lastRowData[15]]);

    }
    lastRow.eachCell((cell, number) => {
      this.designSheet(cell, number, fileName, reportHeadingColumnForProvider, reportHeadingColumnForFacility, 3);
      if(number >= 3){
        cell.alignment = { vertical: 'middle', horizontal: 'center'};
      }
    });

    worksheet.getColumn(2).width = 25;
    worksheet.getRow(16).height = 30;
    worksheet.getRow(17).height = 40;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 25;
    worksheet.getColumn(7).width = 25;
    worksheet.getColumn(8).width = 25;
    worksheet.getColumn(9).width = 25;
    worksheet.getColumn(10).width = 25;
    worksheet.getColumn(11).width = 25;
    worksheet.getColumn(12).width = 20;

    workbooke.xlsx.writeBuffer().then((dataa) => {
      const blob = new Blob([dataa], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    });

  }

  designSheet(cell, number, fileName, reportHeadingColumnForProvider, reportHeadingColumnForFacility, flag){
    if (number == 1) return;

    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

    if(number == 2){
      cell.border = { top: { style: 'thin' }, left: { style: 'thick' }, bottom: { style: 'thin' }}
    }

    if(fileName !== 'facility_performance_report.xlsx' && number == reportHeadingColumnForProvider.length){
      cell.border = { top: { style: 'thin' }, right: { style: 'thick' }, bottom: { style: 'thin' }}
    }
    if(fileName == 'facility_performance_report.xlsx' && number == reportHeadingColumnForFacility.length){
      cell.border = { top: { style: 'thin' }, right: { style: 'thick' }, bottom: { style: 'thin' }}
    }
    if(flag == 1){
      cell.border = { top: { style: 'thick' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    }
    if(flag == 1 && number == 2){
      cell.border = { top: { style: 'thick' }, left: { style: 'thick' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    }
    if(flag == 1 && (number == reportHeadingColumnForFacility.length || number == reportHeadingColumnForProvider.length)){
      cell.border = { top: { style: 'thick' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thick' } }
    }
    if(number >=4 && number <=7 && fileName == 'facility_performance_report.xlsx'){
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
    }
    if(number >=5 && number <=8 && fileName != 'facility_performance_report.xlsx'){
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
    }
    if(flag == 3){
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thick' }, right: { style: 'thin' } }
    }
    if(flag == 3 && fileName !== 'facility_performance_report.xlsx' && number == 2){
      cell.border = { top: { style: 'thin' }, left: { style: 'thick' }, right: { style: 'thin' }, bottom: { style: 'thick' }}
    }
    if(flag == 3 && fileName == 'facility_performance_report.xlsx' && number == 2){
      cell.border = { top: { style: 'thin' }, left: { style: 'thick' }, right: { style: 'thin' }, bottom: { style: 'thick' }}
    }
  }

   // exxport to excel
  exportToExcel2(reportName) {
    const ws: xlsx.WorkSheet =   xlsx.utils.table_to_sheet(this.epltablee.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, reportName);
    console.log("xlsx", xlsx)
    console.log("ws", ws)
    console.log("wb", wb)
   }


  // download as PDF start
  public downloadAsPDF() {
    // if (this.isBrowser) {
    const jsPDF = require('jspdf')
    // const pdf = new jsPDF('p', 'mm', 'a4')
    // pdf.addImage(imgBlob, 'PNG', 0, 0)
    // pdf.save('test.pdf')
    const doc = new jsPDF();
    console.log(doc);

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const pdfTable = this.table.nativeElement;

    doc.autoTable({ html: pdfTable })
    doc.save('table.pdf')
    // doc.fromHTML(pdfTable.innerHTML, 15, 15, {
    //   width: 200,
    //   'elementHandlers': specialElementHandlers
    // });

    doc.save('tableToPdf.pdf');
  }
  // }

// open same result after updating from patient componenet
  submit2(obj) {
    localStorage.setItem("facility",obj.facility);
    localStorage.setItem("provider",obj.provider);
    localStorage.setItem("date",obj.date);
    console.log(obj);
    this.service.findprerecords(obj).subscribe(res =>{
      this.output = res;
      this.gammma =true;
      this.showit = false;
    })

    this.fn = obj.facility;
    this.pn = obj.provider;
    this.dd = obj.date;
    this.resetform();
  }
  open() {
    setTimeout(() => {
      console.log("please call me");
      $("#myModalap").modal("show");

    let f = localStorage.getItem("facility");
    let p = localStorage.getItem("provider");
    let d = localStorage.getItem("date");
    console.log(f+p+d);
   var obj = {
      facility:f,
      provider:p,
      date:d
    }
    // console.log(obj.facility);
    this.submit2(obj);
    }, 100)
  }


  resetform(form?: NgForm) {
    if (form != null) {
      form.resetForm();
    }
    this.repo = {
      facility: '',
      provider: '',
      date: null
    }
  }
  patlist=[]
  submitprovidermedreport(form) {
    this.service.getMedRelatedData(form.value).subscribe(res => {
      console.log(res);
      this.patlist = res;
    })
  }
  pages() {
    const jsPDF = require('jspdf')
    const doc = new jsPDF();
    console.log(doc);
    let html2canvas = require('html2canvas');
    (window as any).html2canvas = html2canvas;
    // doc.addHTML(this.canvas.nativeElement);

    doc.text("This is the default font.", 20, 20);
    // doc.addPage();
    doc.text("This is the default font.", 20, 20);
    doc.setFont("courier");
    doc.setFontStyle("normal");
    doc.text("This is courier normal.", 20, 30);
    console.log("ia am ")
    const filename = `Provider Order Sheet ${new Date()}.pdf`;

    let pdf = new jsPDF('p', 'mm', 'a4');
    let length = this.design.nativeElement.querySelectorAll('.boxxx').length - 1;
    this.design.nativeElement.querySelectorAll('.boxxx').forEach((item, index) => {
      html2canvas(item,
        { scale: 1 }
      ).then(canvas => {
        var img = new Image();
        img.src = 'assets/img/shared/cc.png';
        pdf.addImage(img, 'PNG', 84, 20, 45, 30);
        pdf.setFontSize(15);
        let text = "Psychiatry Care"
        pdf.text(text,87,60);
        let text2 = "10840 N US Highway 301"
        pdf.text(text2,77, 70);
        let text3 = "Oxford FL 34484 "
        pdf.text(text3,86,80);
        let text4 = "Office : (352) 445-1200"
        pdf.text(text4,79, 90);
        let text5 = "Fax: (888) 248-4348"
        pdf.text(text5,82, 100);
        pdf.setFontSize(25);
        let text6 = "Provider Order Sheet (T.O. Sheet)"
        pdf.text(text6,39, 120);

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 7.5, 140, 192, 80);
        if (index == length) {
          pdf.save(filename)
        }
        pdf.addPage();
      });
    })
    console.log(this.design.nativeElement)
    // doc.save('dummy.pdf')
  }
}
