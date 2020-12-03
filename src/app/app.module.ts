import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeDashboardComponent } from './employeedashboard/employeedashboard.component';
import { EmployeeFacilityComponent } from './employeefacility/employeefacility.component';
import { AkComponent } from './ak/ak.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllUserListComponent } from './usershistory/userhistory.component';
import { PatientComponent } from './patient/patient.component';
import { ShowEmployeeDocuemntComponent } from './showemployeedocuments/showemployeedocumentpatient.component';
import { RegisterComponent } from './register/register.component';
import { TokenInterceptorService } from './shared/token-interceptor.service';
import { DataTransferService } from './shared/data-transfer.service';
import { ToastrModule } from 'ngx-toastr';
import { ExpensiveComponent } from './expensive/expensive.component';
import { FacilityComponent } from './facility/facility.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { ProviderComponent } from './provider/provider.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PipePipe } from './pipe.pipe';
import { ReportsComponent } from './reports/reports.component';
import { AttchFileComponent } from './attachfiles/attchfile.component';
import { EmployeeVacationComponent } from './employeevacation/employeevacation.component';
import { EmployeeVacationHistoryComponent } from './vacationhistory/vacationhistory.component';
import { AllEmployeeVacationHistoryComponent } from './allemployeevacationhistory/allemployeevacationhistory.component';
import { AllEmployeeReceiptHistoryComponent } from './allemployeereceipthistory/allemployeereceipthistory.component';
import { InsuranceInformationComponent } from './insuranceinformation/insuranceinformation.component';
import { ModuleDashboardComponent } from './moduledashboard/moduledashboard.component';
import { EmployeeFacilityApprovalComponent } from './employeefacilityapproval/employeefacilityapproval.component';
import { SharedDashboardComponent } from './shareddashboard/shareddashboard.component';
import { FilterPipe } from './filter.pipe';
import { FilterNamePipe } from './filter-name.pipe';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FilterdatePipe } from './filterdate.pipe';
import { CapitalizePipe } from './capitalize.pipe';
import { CombinepatComponent } from './combinepat/combinepat.component';
import {DatePipe} from '@angular/common';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ReceiptSubmitComponent } from './receiptsubmit/receiptsubmit.component';
import { EmployeeReceiptHistoryComponent } from './receipthistory/receipthistory.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    EmployeeDashboardComponent,
    EmployeeFacilityComponent,
    AkComponent,
    AllUserListComponent,
    PatientComponent,
    ShowEmployeeDocuemntComponent,
    RegisterComponent,
    ExpensiveComponent,
    FacilityComponent,
    InsuranceComponent,
    ProviderComponent,
    PipePipe,
    ReportsComponent,
    AttchFileComponent,
    EmployeeVacationComponent,
    EmployeeVacationHistoryComponent,
    AllEmployeeVacationHistoryComponent,
    AllEmployeeReceiptHistoryComponent,
    InsuranceInformationComponent,
    ModuleDashboardComponent,
    EmployeeFacilityApprovalComponent,
    SharedDashboardComponent,
    FilterPipe,
    FilterNamePipe,
    FilterdatePipe,
    CapitalizePipe,
    CombinepatComponent,
    ForgotpasswordComponent,
    ReceiptSubmitComponent,
    EmployeeReceiptHistoryComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    NgSelectModule,
    NgOptionHighlightModule,
  ],
  providers: [DataTransferService, DatePipe,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
