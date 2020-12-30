import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeDashboardComponent } from './employeedashboard/employeedashboard.component';
import { EmployeeFacilityComponent } from './employeefacility/employeefacility.component';
import { AkComponent } from './ak/ak.component';
import { PatientComponent } from './patient/patient.component';
import { ShowEmployeeDocuemntComponent } from './showemployeedocuments/showemployeedocumentpatient.component';
import { AllUserListComponent } from './usershistory/userhistory.component';
import { RegisterComponent } from './register/register.component';
import { RouteGuard } from './route.guard';
import { FacilityComponent } from './facility/facility.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { ProviderComponent } from './provider/provider.component';
import { ExpensiveComponent } from './expensive/expensive.component';
import { ReportsComponent } from './reports/reports.component';
import { CombinepatComponent } from './combinepat/combinepat.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { AttchFileComponent } from './attachfiles/attchfile.component';
import { EmployeeVacationComponent } from './employeevacation/employeevacation.component';
import { EmployeeVacationHistoryComponent } from './vacationhistory/vacationhistory.component';
import { AllEmployeeVacationHistoryComponent } from './allemployeevacationhistory/allemployeevacationhistory.component';
import { AllEmployeeReceiptHistoryComponent } from './allemployeereceipthistory/allemployeereceipthistory.component';
import { InsuranceInformationComponent } from './insuranceinformation/insuranceinformation.component';
import { SharedDashboardComponent } from './shareddashboard/shareddashboard.component';
import { ModuleDashboardComponent } from './moduledashboard/moduledashboard.component';
import { EmployeeFacilityApprovalComponent } from './employeefacilityapproval/employeefacilityapproval.component';
import { ReceiptSubmitComponent } from './receiptsubmit/receiptsubmit.component';
import { EmployeeReceiptHistoryComponent } from './receipthistory/receipthistory.component';
import { OvertimeSubmitComponent } from './overtimesubmit/overtimesubmit.component';
import { EmployeeOvertimeHistoryComponent } from './overtimehistory/overtimehistory.component';
import { AllEmployeeOvertimeHistoryComponent } from './allemployeeovertimehistory/allemployeeovertimehistory.component';
import { LectureSubmitComponent } from './lecturesubmit/lecturesubmit.component';
import { EmployeeLectureHistoryComponent } from './lecturehistory/lecturehistory.component';
import { AllEmployeeLectureHistoryComponent } from './allemployeelecturehistory/allemployeelecturehistory.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dash', component: DashboardComponent, canActivate: [RouteGuard] },
  {path: 'employeedash', component: EmployeeDashboardComponent, canActivate: [RouteGuard]},
  { path: 'employeefacility', component: EmployeeFacilityComponent },
  { path: 'ak', component: AkComponent },
  { path: 'patient', component: PatientComponent, canActivate: [RouteGuard] },
  { path: 'showdocuments', component: ShowEmployeeDocuemntComponent,  canActivate: [RouteGuard]  },
  { path: 'userlist', component: AllUserListComponent,  canActivate: [RouteGuard]  },
  { path: 'register', component: RegisterComponent, canActivate: [RouteGuard] },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'facility', component: FacilityComponent, canActivate: [RouteGuard] },
  { path: 'insurance', component: InsuranceComponent, canActivate: [RouteGuard] },
  { path: 'provider', component: ProviderComponent, canActivate: [RouteGuard] },
  { path: 'expensive', component: ExpensiveComponent, canActivate: [RouteGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [RouteGuard] },
  { path: 'cpat', component: CombinepatComponent,  canActivate: [RouteGuard]  },
  { path: 'attachfile', component: AttchFileComponent,  canActivate: [RouteGuard]  },
  { path: 'employeevacation', component: EmployeeVacationComponent,  canActivate: [RouteGuard]  },
  { path: 'vacationhistory', component: EmployeeVacationHistoryComponent,  canActivate: [RouteGuard]  },
  { path: 'allvacationhistory', component: AllEmployeeVacationHistoryComponent,  canActivate: [RouteGuard]  },
  { path: 'shareddashboard', component: SharedDashboardComponent,  canActivate: [RouteGuard]  },
  { path: 'moduledashboard', component: ModuleDashboardComponent,  canActivate: [RouteGuard]  },
  { path: 'insuranceinformation', component: InsuranceInformationComponent,  canActivate: [RouteGuard]  },
  { path: 'employeefacilityapproval', component: EmployeeFacilityApprovalComponent,  canActivate: [RouteGuard]  },
  { path: 'receipt', component: ReceiptSubmitComponent,  canActivate: [RouteGuard]  },
  { path: 'receipthistory', component: EmployeeReceiptHistoryComponent,  canActivate: [RouteGuard]  },
  { path: 'receiptapproval', component: AllEmployeeReceiptHistoryComponent,  canActivate: [RouteGuard]  },
  { path: 'saveovertime', component: OvertimeSubmitComponent,  canActivate: [RouteGuard]  },
  { path: 'overtimehistory', component: EmployeeOvertimeHistoryComponent,  canActivate: [RouteGuard]  },
  { path: 'allovertimehistory', component: AllEmployeeOvertimeHistoryComponent,  canActivate: [RouteGuard]  },
  { path: 'savelecture', component: LectureSubmitComponent,  canActivate: [RouteGuard]  },
  { path: 'lecturehistory', component: EmployeeLectureHistoryComponent,  canActivate: [RouteGuard]  },
  { path: 'lectureapproval', component: AllEmployeeLectureHistoryComponent,  canActivate: [RouteGuard]  },
  { path: '**', component: DashboardComponent,  canActivate: [RouteGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
