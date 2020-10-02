import { Component, OnInit } from '@angular/core';
import { Facility, DataTransferService } from '../shared/data-transfer.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.scss']
})
export class FacilityComponent implements OnInit {

  constructor(public service: DataTransferService, public toastr: ToastrService) { }
  facilityData: Facility;
  metaData = false;
  facilities: any;
  public searchString: string;
  fname = '';
  role;
  ngOnInit() {
    this.resetForm();
    this.service.cc2$
      .subscribe(
        message => {
          if (message === 'yes') {
            this.app();
          }
        }
      );
    this.service.getData()
      .subscribe(
        res => {
          const user = res;
          this.fname = user.fname;
          this.role =  user.userrole;
          this.metaData = true;
        }, err => {
          if (err instanceof HttpErrorResponse) {
            this.service.router.navigateByUrl('/');
          }
        });
    this.service.getFacility().subscribe(res => {
      this.facilities = res;
    });
    const $button = document.querySelector('#sidebar-toggle');
    const $wrapper = document.querySelector('#wrapper');

    $button.addEventListener('click', (e) => {
      e.preventDefault();
      $wrapper.classList.toggle('toggled');
    });
  }
  func() {
    this.resetForm();
  }
  logout() {
    this.service.logout();
  }
  resetForm(form?: NgForm) {
    this.edit = false;
    if (form != null) {
      form.resetForm();
    }
    this.facilityData = {
      id: null,
      name: '',
      address: '',
      capacity: '',
      address1: '',
      address2: '',
      tof: 'nh',
      sn: '',
      city: '',
      state: '',
      ain: 'Active'
    };
  }
  s_id;
  edit = false;
  assign(data, id) {
    this.s_id = id;
    this.facilityData = data;
    this.edit = true;
  }
  submit(form: NgForm) {
    this.service.sendFacility(form).subscribe(res => {
      this.toastr.success('', 'Facility Saved Successfully');
    });
    this.resetForm(form);
    this.ngOnInit();
    $('#myModalap').modal('hide');
  }
  app() {
    setTimeout(() => {
      $('#myModalap').modal('show');
    }, 100);
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
}
