import { Component, OnInit, ViewEncapsulation, ViewChild, PipeTransform, ElementRef  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DecimalPipe, DatePipe } from '@angular/common';
import * as moment from 'moment';
const swal = require('sweetalert');

const _clone = (d) => JSON.parse(JSON.stringify(d));

@Component({
  selector: "app-credmemo",
  templateUrl: "./credmemo.component.html",
  styleUrls: ["./credmemo.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CredmemoComponent implements OnInit {
  cmForm: FormGroup;

  //select option variable
  categories = [];
  branches = [];
  paymodes = [];
  patienttypes = [];
  salespersons = [];
  
  dateValid(AC: AbstractControl) {
    if (AC && AC.value && !moment(AC.value, "MM/DD/YYYY", true).isValid()) {
      return { dateVaidator: true };
    }
    return null;
  }

  constructor(fb: FormBuilder) {
    
    //load select options
    this.LoadCategories();
    this.LoadBranches();
    this.LoadPaymode();
    this.LoadPatientTypes();
    this.LoadSalesPersons();


    //form
    this.cmForm = fb.group({
      labno: [null, Validators.required],
      whscode: ["011", Validators.required],
      docdate: [
        null,
        Validators.compose([Validators.required, this.dateValid]),
      ],
      docentry: [null, [Validators.pattern("^[0-9]+$"), Validators.required]],
      doctotal: [null, [Validators.pattern("^[0-9]+$"), Validators.required]],
      balance: [null, [Validators.pattern("^[0-9]+$"), Validators.required]],
      cardcode: [null, Validators.required],
      cardname: [null, Validators.required],
      creditmemo: [null, Validators.required],
      refno: [null, Validators.required],
      transnum: [null, Validators.required],
      remarks: [null, Validators.required],
      soano: [null],
      soadate: [null],
      category: [this.categories[0].Code, Validators.required],
      count: [null, [Validators.pattern("^[0-9]+$"), Validators.required]],
      patient: [null, Validators.required],
      transdate: ["",Validators.compose([Validators.required, this.dateValid])],
      paymode: [null, Validators.required],
      patienttype: [null, Validators.required],
      dcode: [null, Validators.required],
      salesperson: [null, Validators.required],
      source: [null, Validators.required],
      status: [null, Validators.required],
      retainlabno: [],


      // docdate : [null, Validators.required],
      // desc: [null, Validators.required],
      // count: [null, [Validators.pattern("^[0-9]+$"), Validators.required]],
      // category: [null, [Validators.pattern("^[0-9]+$"), Validators.required]],
      // receipt: [null, [Validators.pattern("^[0-9]+$"), Validators.required]],
      // reason: [],

      // 'sometext': [null, Validators.required],
      // 'checkbox': [null, Validators.required],
      // 'radio': ['', Validators.required],
      // 'select': [null, Validators.required],
      // 'digits': [null, Validators.pattern('^[0-9]+$')],
      // 'minlen': [null, Validators.minLength(6)],
      // 'maxlen': [null, Validators.maxLength(10)],
      // 'email': [null, CustomValidators.email],
      // 'url': [null, CustomValidators.url],
      // 'date': [null, CustomValidators.date],
      // 'number': [null, Validators.compose([Validators.required, CustomValidators.number])],
      // 'alphanum': [null, Validators.pattern('^[a-zA-Z0-9]+$')],
      // 'minvalue': [null, CustomValidators.min(6)],
      // 'maxvalue': [null, CustomValidators.max(10)],
      // 'minwords': [null, this.minWords(6)],
      // 'maxwords': [null, this.maxWords(10)],
      // 'minmaxlen': [null, CustomValidators.rangeLength([6, 10])],
      // 'range': [null, CustomValidators.range([10, 20])],
      // 'rangewords': [null, Validators.compose([this.minWords(6), this.maxWords(10)])],
      // 'email_bl': [null, this.checkBlackList(this.blackList)],

      // 'passwordGroup': fb.group({
      //   password: password,
      //   confirmPassword: certainPassword
      // })
    });
  }

  ngOnInit(): void {
    this.cmForm.controls["count"].setValue(0, { onlySelf: true }); //select option default value
  }

  //api variable
  apiurl = "";

  api_loader(cb) {
    const req = new XMLHttpRequest();
    req.open("GET", this.apiurl, false);
    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }

  //load select option -------------------------------------------------------- >
  LoadCategories() {
    this.apiurl = `http://192.168.1.165:8080/cmcat`;
    this.api_loader((data) => {
      // cache our list
      this.categories = _clone(data);
    });
  }

  LoadBranches() {
    this.apiurl = `http://192.168.1.165:8080/cmbranches`;
    this.api_loader((data) => {
      // cache our list
      this.branches = _clone(data);
    });
  }

  LoadPaymode() {
    this.apiurl = `http://192.168.1.165:8080/cmpaymode`;
    this.api_loader((data) => {
      // cache our list
      this.paymodes = _clone(data);
    });
  }

  LoadPatientTypes(){
      this.apiurl = `http://192.168.1.165:8080/cmpatienttype`;
      this.api_loader((data) => {
        // cache our list
        this.patienttypes = _clone(data);
      });
  }

  LoadSalesPersons() {
    this.apiurl = `http://192.168.1.165:8080/cmsalesperson`;
    this.api_loader((data) => {
      // cache our list
      this.salespersons = _clone(data);
    });
  }

  //end load select option -------------------------------------------------------- >

  //Functions ------------------------------------------------------------ >

  CategoryCount(){
    // this.cmForm.setValue()
    this.cmForm.controls['count'].setValue(this.cmForm.value.category);    
  }

  //End Functions -------------------------------------------------------- >

}
