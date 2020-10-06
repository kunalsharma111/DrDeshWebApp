import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DataTransferService } from '../shared/data-transfer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  roles = ['Admin', 'Provider', 'Data Entry Operator'];
  constructor(public ctrl: DataTransferService, public toastr: ToastrService, private formBuilder: FormBuilder) { }
  user;
  name: string;
  metaData;
  registerForm: FormGroup;
  submitted = false;

  get f() { return this.registerForm.controls; }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      userrole: ['', Validators.required],
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      // empId: ['', Validators.required],
      // dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', Validators.required]
    });
    this.name = '';
    this.ctrl.getData()
      .subscribe(
        res => {
          this.user = res;
          this.name = this.user.fname;
          this.metaData = true;
        }, err => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            this.ctrl.router.navigateByUrl('/');
          }
        });

    const $button = document.querySelector('#sidebar-toggle');
    const $wrapper = document.querySelector('#wrapper');

    $button.addEventListener('click', (e) => {
      e.preventDefault();
      $wrapper.classList.toggle('toggled');
    });
    this.onReset();
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  onSubmit() {
    this.submitted = true;

        // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.ctrl.transferToServer(this.registerForm).subscribe(res => {
      // localStorage.setItem('token', res.token);
      this.toastr.success('', 'New User Created');
    });
    this.onReset();
    // this.ctrl.router.navigateByUrl('/dash');
  }
  logout() {
    this.ctrl.logout();
  }
  ap() {
    this.ctrl.topatient('yes');
  }
  app() {
    this.ctrl.toprovider('yes');
  }
  af() {
    this.ctrl.tofacility('yes');
  }
  ai() {
    this.ctrl.toinsurance('yes');
  }
  ae() {
    this.ctrl.toexpensive('yes');
  }

}
