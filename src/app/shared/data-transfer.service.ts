import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { filter, delay, map, catchError, switchMap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Admin {
  fname: string;
  lname: string;
  empId: number;
  dob: Date;
  pwd: string;
  email: string;
  mobile: string;
  userrole: string;
  otp: string;
}
export interface Insurance {
  id: string;
  name: string;
  ain: string;
}
export interface Provider {
  id: string;
  name: string;
  insurance: string;
  ain: string;
}
export interface Medication {
  id: string;
  name: string;
  ain: string;
}
export interface combined {
  id: string;
  name: string;
  dob: Date;
  patientcreatedon: Date;
  patientcreatedby: string;
  savedon: Date;
  savedby: string;
  pcp: string;
  typevisit: string;
  visit: Date;
  seedoc: string;
  noseedocreason: string;
  stable: string;
  gdrstable: string;
  psythreapy: string;
  labs: string;
  labname: string;
  medmanage: string;
  reasonmedmanage: string;
  reasonpsy: string;
  psyscreen: string;
  psyscreenreason: string;
  followup: string;
  patientcondition: string;
  unstable_text: string;
  started: string;
  increase: string;
  decrease: string;
  stopped: string;
  decrease2: string;
  stopped2: string;
  medstopdate: Date;
  newappointmentrecord: string;
  added: string;
  addeddate: string;
  yesstable: string;
  nostable: string;
  theligible: string;
  pinsurance: string;
  sinsurance: string;
  facility: string;
  provider: string;
  room: string;
  medication: string;
  medicationName: string;
  generictest: string;
  genericresult: string;
  docterupload: string;
  demographicsheetuploaded: string;
  capacityassesment: string;
  capacity: string;
  bhi: string;
  ccm: string;
  bhiconcent: string;
  ccmconcent: string;
  medmanage2: string;
  scaleeligible: string;
  scale: string;
  comment: string;
  service_type: string;
  frequentlypsychotherapy: number;
  verystable: string;
  psymanage: string;
  seepsy: string;
  noseepsyreason: string;
  yesstablepsy: '';
  nostablepsy: '';
  verystablepsy: '';
  careconditiontimespent: string;
  medreason: string;
  othermedreason: string;
  geneticreason: string;
  othergeneticreason: string;
  medreason2: string;
  othermedreason2: string;
  psyreason: string;
  otherpsyreason: string;
  otherpsyscreenreason: string;
  bhireason: string;
  otherbhireason: string;
  ccmreason: string;
  otherccmreason: string;
  homeclinic: string;
  homeclinicconcent: string;
  homeclinicreason: string;
  otherhomeclinicreason: string;
  masterstable: string;
  typevisitreason: string;
  masterstablereason: string;
  thtime: number;
  othernoseedocreason: string;
  psynoseedocreason: string;
  otherpsynoseedocreason: string;
  consult: string;
  conpsy: string;
  conmed: string;
  conscr: string;
  conpsyreason: string;
  conmedreason: string;
  conscrreason: string;
  conpsyname: string;
  currentmeds: string;
  np: string;
  cch: string;
  cchconcent: string;
  cchdate: Date;
  cchreason: string;
  othercchreason: string;
  medfollowup: string;
  followupreason: string;
  followupdays: Date;
  scaleeligiblereason: string;
  otherscaleeligiblereason: string;
  flag: number;
  nextvisitdate: Date;
}
export interface PatientRound2 {
  id: string;
  eval: string;
  visit: Date;
  seedoc: string;
  droped: string;
  stable: string;
  gdrstable: string;
  psythreapy: string;
  labs: string;
  labname: string;
  medmange: string;
  urgentcall: string;
  outreach: string;
  followup: string;
  patientcondition: string;
  unstable_text: string;
  started: string;
  increase: string;
  decrease: string;
  stopped: string;
  decrease2: string;
  stopped2: string;
  medstopdate: Date;
  psa: string;
  newappointmentrecord: string;
  providername: string;
  added: string;
  addeddate: string;
  yesstable: string;
  nostable: string;
}
export interface Facility {
  id: string;
  name: string;
  address: string;
  capacity: string;
  address1: string;
  address2: string;
  tof: string;
  sn: string;
  city: string;
  state: string;
  ain: string;
}
export interface Patient {
  id: string;
  name: string;
  dob: Date;
  theligible: string;
  pinsurance: string;
  sinsurance: string;
  facility: string;
  provider: string;
  room: string;
  medication: string;
  medicationName: string;
  generictest: string;
  genericresult: string;
  docterupload: string;
  demographicsheetuploaded: string;
  capacityassesment: string;
  capacity: string;
  bhi: string;
  ccm: string;
  scaleeligible: string;
  scale: string;
  comment: string;
  patientcondition: string;
  service_type: string;
  psychotherapydate: string;
  frequentlypsychotherapy: number;
}
@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  adminData: Admin;
  patientData: combined;
  private c1 = new Subject<string>();
  cc1$ = this.c1.asObservable();
  roleType;
  private c2 = new Subject<string>(); cc2$ = this.c2.asObservable();
  private c3 = new Subject<string>(); cc3$ = this.c3.asObservable();
  private c4 = new Subject<string>(); cc4$ = this.c4.asObservable();
  private c5 = new Subject<string>(); cc5$ = this.c5.asObservable();
  private c6 = new Subject<string>(); cc6$ = this.c6.asObservable();
  metcha = 'http://3.128.218.140:4000/api';
  // metcha = 'http://localhost:4000/api';
  // metcha = environment.api_url;
  url = `${this.metcha}/login`;
  url1 = `${this.metcha}/users`;
  url2 = `${this.metcha}/red`;
  url3 = `${this.metcha}/pat`;
  url4 = `${this.metcha}/patien`;
  url5 = `${this.metcha}/sendmoredata`;
  url6 = `${this.metcha}/r2`;
  url7 = `${this.metcha}/r2p`;
  url8 = `${this.metcha}/facilityadd`;
  url9 = `${this.metcha}/getfacility`;
  url10 = `${this.metcha}/insuranceadd`;
  url11 = `${this.metcha}/getinsurance`;
  url12 = `${this.metcha}/provideradd`;
  url13 = `${this.metcha}/getprovider`;
  url14 = `${this.metcha}/medadd`;
  url15 = `${this.metcha}/getmed`;
  url16 = `${this.metcha}/goku`;
  url17 = `${this.metcha}/basedata`;
  url18 = `${this.metcha}/get`;
  url19 = `${this.metcha}/preround`;
  url20 = `${this.metcha}/otp`;
  url21 = `${this.metcha}/confirmotp`;
  url22 = `${this.metcha}/changepassword`;
  url23 = `${this.metcha}/providerperformancereport`;
  url24 = `${this.metcha}/facilityreport`;
  url25 = `${this.metcha}/postreport`;
  url26 = `${this.metcha}/medreport`;
  url27 = `${this.metcha}/fetchByName`;
  url28 = `${this.metcha}/getactivefacility`;
  url29 = `${this.metcha}/getactiveprovider`;
  url30 = `${this.metcha}/call`;
  apiUrlForFacilitySummary = `${this.metcha}/facilitysummaryreport`;
  apiUrlForPatientSummary = `${this.metcha}/patientsummaryreport`;
  apiUrlForMedicationReport = `${this.metcha}/expensivemedicationreport`;
  apiUrlForAllPatients = `${this.metcha}/getpatientsasperkey`;
  getpatientdetail = `${this.metcha}/patientdetail`;
  apiUrlForAllExpensiveMedicine = `${this.metcha}/getmedicineasperkey`;
  employeeDetails = `${this.metcha}/employeedetails`;
  addEmpDocumentsByAdmin = `${this.metcha}/addemployeedocumentbyadmin`;
  getEmployeeDetailsUrl = `${this.metcha}/fetchfiles`;
  employeeDocumentsRemark = `${this.metcha}/employeedocumentsremark`;
  getEmployeeDocuemntUrl = `${this.metcha}/getemployeedocuments`;
  getRequireDocuemntUrl = `${this.metcha}/getemployeedocumentslist`;
  storeEmployeeFacility = `${this.metcha}/storeEmployeeFacility`;
  getEmployeeFacilities = `${this.metcha}/getEmployeeFacilities`;
  addFacilityToEmployee = `${this.metcha}/addFacilityToEmployee`;
  getEmployeeSubscribefacilities = `${this.metcha}/getEmployeeSubscribefacilities`;
  saveEmployeeVacation = `${this.metcha}/saveEmployeeVacation`;
  getVacationHistoryUrl = `${this.metcha}/getvacationhistory`;
  getAllEmployeeVacationHistoryUrl = `${this.metcha}/getvacationhistoryforallemployee`;
  updateEmployeeVacationUrl = `${this.metcha}/updateemployeevacation`;
  getAllUsersUrl = `${this.metcha}/getallusers`;
  updateEmployeeDetailsUrl = `${this.metcha}/updateemployeedetails`;
  getAllAdminsUrl = `${this.metcha}/getalladmin`;
  storeReceiptPeriod = `${this.metcha}/storereceiptperiod`;
  getReceiptPeriod = `${this.metcha}/getreceiptperiod`;
  saveReceiptRecords = `${this.metcha}/receiptsubmit`;
  getReceiptHistory = `${this.metcha}/getreceipthistory`;
  updateEmployeeReceiptUrl = `${this.metcha}/updateemployeereceipt`;
  allReceiptHistoryUrl = `${this.metcha}/getreceipthistoryforallemployee`;

  constructor(public http: HttpClient, public router: Router, public _route: ActivatedRoute) { }

  subject = new BehaviorSubject('123');
  checkLogin(dorm) {
    return this.http.post<any>(this.url, dorm.value);
  }
  call() {
    console.log('second step');
    this.http.get<any>(this.url30).subscribe(res => {
    console.log('output');
    console.log(res);
   });
  }
  sendotp(form) {
    return this.http.post<any>(this.url20, form.value);
  }
  compareotp(form) {
    return this.http.post<any>(this.url21, form.value);
  }
  newpassword(form) {
    return this.http.post<any>(this.url22, form.value);
  }
  transferToServer(form) {
    return this.http.post<any>(this.url1, form.value);
  }
  loggedIn() {
    return !!localStorage.getItem('token');
  }
  getToken() {
    return localStorage.getItem('token');
  }
  getData() {
    return this.http.get<any>(this.url2);
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('moduleType');
    this.router.navigateByUrl('/');
  }
  addBasePatientData(form) {
    return this.http.post<any>(this.url3, form);
  }

  addEmployeeDetails(form) {
    return this.http.post<any>(this.employeeDetails, form);
  }

  addEmployeeDocByAdmin(form) {
    return this.http.post<any>(this.addEmpDocumentsByAdmin, form);
  }

  addfacilityForEmployee(data) {
    // console.log('data', data);
    return this.http.post<any>(this.addFacilityToEmployee, data);
  }

  getEmployeeSubscribeFacility() {
    return this.http.post<any>(this.getEmployeeSubscribefacilities, {});
  }

  getEmployeeDetails() {
    return this.http.post<any>(this.getEmployeeDetailsUrl, {});
  }

  getPatientData() {
    return this.http.get(this.url4);
  }
  sendMorePatientData(userForm) {
    return this.http.post<any>(this.url5, userForm);
  }
  sendDataRound2(data) {
    return this.http.post<any>(this.url6, data.value);
  }
  getR2Data() {
    return this.http.get<any>(this.url7);
  }
  sendFacility(form) {
    return this.http.post<any>(this.url8, form.value);
  }
  getFacility() {
    return this.http.get<any>(this.url9);
  }
  getActiveFacility() {
    return this.http.get<any>(this.url28);
  }
  sendInsurance(form) {
    return this.http.post<any>(this.url10, form.value);
  }
  getInsurance() {
    return this.http.get<any>(this.url11);
  }
  sendProvider(form) {
    return this.http.post<any>(this.url12, form);
  }
  getProvider() {
    return this.http.get<any>(this.url13);
  }
  getActiveProvider() {
    return this.http.get<any>(this.url29);
  }
  sendMed(form) {
    return this.http.post<any>(this.url14, form.value);
  }
  getMed() {
    return this.http.get<any>(this.url15);
  }
  topatient(message: string) {
    setTimeout(() => {
      this.c1.next('yes');
    }, 100);
    this.router.navigateByUrl('/patient');
  }
  tofacility(message: string) {
    setTimeout(() => {
      this.c2.next('yes');
    }, 100);
    this.router.navigateByUrl('/facility');
  }
  toprovider(message: string) {
    setTimeout(() => {
      this.c3.next('yes');
    }, 100);
    this.router.navigateByUrl('/provider');
  }
  toinsurance(message: string) {
    setTimeout(() => {
      this.c4.next('yes');
    }, 100);
    this.router.navigateByUrl('/insurance');
  }
  toexpensive(message: string) {
    setTimeout(() => {
      this.c5.next('yes');
    }, 100);
    this.router.navigateByUrl('/expensive');
  }
  toreport(message: string) {
    setTimeout(() => {
      this.c6.next('yes');
    }, 100);
    this.router.navigateByUrl('/reports');
  }
  createdownloadlink(some) {
  }
  submitMasterPatientData(data) {
    // console.log('i am inside service and getting triggered');
    // console.log(data);
    return this.http.post<any>(this.url16, data);
    // .subscribe(res => {
    //   console.log(res)
    // });
  }
  useriden(id?: string) {
    this.subject.next(id);
  }
  sendBaseData(data) {
    return this.http.post<any>(this.url17, data);
  }
  getByid(id) {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(this.url18, {params});
  }
  findprerecords(data) {
    return this.http.post<any>(this.url19, data);
  }
  findproviderreport(data) {
    return this.http.post<any>(this.url23, data);
  }
  findfacilityreport(data) {
    return this.http.post<any>(this.url24, data);
  }

  getEmployeeFacility() {
    return this.http.post<any>(this.getEmployeeFacilities, {});
  }

  facilitySummaryReport(data) {
    return this.http.post<any>(this.apiUrlForFacilitySummary, data);
  }

  patientSummaryReport(data) {
    return this.http.post<any>(this.apiUrlForPatientSummary, data);
  }

  expensiveMedicationReport(data) {
    return this.http.post<any>(this.apiUrlForMedicationReport, data);
  }

  setRoleTypeAfterRefresh() {
    return this.getData();
  }

  setRole(role) {
    this.roleType = role;
  }

  getRole() {
    return this.roleType;
  }

  getAllPatientData(enterCharacter) {
    return this.http.post<any>(this.apiUrlForAllPatients, enterCharacter);
  }

  getAllExpensiveMedicine(enterCharacter) {
    return this.http.post<any>(this.apiUrlForAllExpensiveMedicine, enterCharacter);
  }

  getMedicine(term: string | null): Observable<any[]> {
    if (term !== null && term.length >= 3) {
      return this.getAllExpensiveMedicine({'enterKey': term}).pipe(
        catchError(err => of([])),
        switchMap(medicines => {
          if (medicines === 'no') {
            return of([]);
          } else {
            return of (medicines);
          }
        })
      );
    } else {
      return  of([]);
    }
  }

  getPeople(term: string | null): Observable<any[]> {
    if (term !== null && term.length >= 3) {
      return this.getAllPatientData({'enterKey': term}).pipe(
        catchError(err => of([])),
        switchMap(patients => {
          if (patients === 'no') {
            return of([]);
          } else {
            return of (patients);
          }
        })
      );
    } else {
      return  of([]);
    }
  }

  private history = [];
  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/index';
  }
  getpostroundingreport(data) {
    return this.http.post<any>(this.url25, data);
  }
  getMedRelatedData(data) {
    return this.http.post<any>(this.url26, data);
  }
  getRequireDocuemnts() {
    return this.http.post<any>(this.getRequireDocuemntUrl, {});
  }

  getEmployeeDocuemnt(data) {
    return this.http.post<any>(this.getEmployeeDocuemntUrl, data);
  }

  attachmentRemarkByAdmin(data) {
    return this.http.post<any>(this.employeeDocumentsRemark, data);
  }

  storeEmployeeVacation(data) {
    return this.http.post<any>(this.saveEmployeeVacation, data.value);
  }

  getVacationHistory(data) {
    return this.http.post<any>(this.getVacationHistoryUrl, data);
  }

  getAllEmployeeVacationHistory(data) {
    return this.http.post<any>(this.getAllEmployeeVacationHistoryUrl, data);
  }

  updateEmployeeVacation(data) {
    return this.http.post<any>(this.updateEmployeeVacationUrl, data);
  }

  updateEmployeeReceipt(data){
    return this.http.post<any>(this.updateEmployeeReceiptUrl, data);
  }

  allReceiptHistory(data){
    return this.http.post<any>(this.allReceiptHistoryUrl, data);
  }

  getAllAdmins(data){
    return this.http.post<any>(this.getAllAdminsUrl, data);
  }

  storeReceiptPeriodData(data){
    return this.http.post<any>(this.storeReceiptPeriod, data);
  }

  getReceiptPeriodData(){
    return this.http.post<any>(this.getReceiptPeriod, {});
  }

  saveReceiptData(data){
    return this.http.post<any>(this.saveReceiptRecords, data);
  }

  getReceiptHistoryForEmployee(data) {
    return this.http.post<any>(this.getReceiptHistory, data);
  }

  updateEmployeeDetails(data) {
    return this.http.post<any>(this.updateEmployeeDetailsUrl, data);
  }

  getAllUsers(data) {
    return this.http.post<any>(this.getAllUsersUrl, data);
  }

  getpatient(id) {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(this.getpatientdetail, {params});
  }
}
