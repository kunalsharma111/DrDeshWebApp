import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { DataTransferService } from '../shared/data-transfer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Inject(Window) private window: any;
  @ViewChild('ctr', { static: true }) ctr: ElementRef;
  @ViewChild('page', { static: true }) page: ElementRef;
  constructor(public http: HttpClient, public service: DataTransferService, private renderer: Renderer2, private toastr: ToastrService) { }

  user = {
    email: '',
    pwd: ''
  };
  resetForm(form: NgForm) {
    this.user.email = '';
    this.user.pwd = '';
  }
  ngOnInit() {
  }
  submit(form) {
    this.renderer.setStyle(this.page.nativeElement, 'filter', 'blur(4px)');
    this.renderer.setStyle(this.ctr.nativeElement, 'display', 'block');
    this.service.checkLogin(form).subscribe(res => {
      this.service.setRole(res.role);
      localStorage.setItem('token', res.token);
      if (res.role !== 'Data Entry Operator') {
        localStorage.setItem('moduleType', 'homedash');
        this.service.router.navigate(['/moduledashboard']);
      } else {
        localStorage.setItem('moduleType', 'patient');
        this.service.router.navigate(['/dash']);
      }
    },
      (err) => {
        this.renderer.setStyle(this.ctr.nativeElement, 'display', 'none');
        this.renderer.setStyle(this.page.nativeElement, 'filter', 'blur(0)');
        if (err instanceof HttpErrorResponse)
          this.toastr.error('Username/Password is Incorrect','Login Failed');
      });
    this.resetForm(form);
  }

}
