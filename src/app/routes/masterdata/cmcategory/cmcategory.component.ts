import { Component, OnInit, ViewEncapsulation, ViewChild, PipeTransform  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DecimalPipe, DatePipe } from '@angular/common';

const _clone = (d) => JSON.parse(JSON.stringify(d));


@Component({
  selector: 'app-cmcategory',
  templateUrl: './cmcategory.component.html',
  styleUrls: ['./cmcategory.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CmcategoryComponent implements OnInit {

  editing = {};
  rows = [];
  rowsFilter = [];
  rowsExp = [];
  rowsSort = [];
  temp = [];
  expanded: any = {};
  timeout: any;

  rowsSel = [];
  selected = [];

   columns = [
      { prop: 'name' },
      { name: 'Code' },
      { name: 'Desc' },
      { name: 'Count' },
      { name: 'Category' },
      { name: 'Rcpt' },
      { name: 'Reason' }
   ];

   columnsSort = [
     { prop: 'name' },
     { name: 'Code' },
     { name: 'Desc' },
     { name: 'Cnt' },
     { name: 'Category' },
     { name: 'Rcpt' },
     { name: 'Reason' }
   ];


  valForm: FormGroup;
  blackList = ['bad@email.com', 'some@mail.com', 'wrong@email.co'];


  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('myTable') tableExp: any;

  constructor(private npipe: DecimalPipe, private dpipe: DatePipe, fb: FormBuilder) {    
    this.fetch((data) => {      
      // cache our list      
      this.temp = _clone(data);      
      this.rows = _clone(data);
      this.rowsFilter = _clone(data);
      this.rowsExp = _clone(data);
      this.rowsSort = _clone(data);
      this.rowsSel = _clone(data);      
    });

    let password = new FormControl('', Validators.required);
    let certainPassword = new FormControl('', CustomValidators.equalTo(password));
    

    // Model Driven validation
    this.valForm = fb.group({

      'code': [null, Validators.pattern('^[0-9]+$')],
      'desc': [null, Validators.required],
      'count': [null, Validators.pattern('^[0-9]+$')],
      'category': [null, Validators.pattern('^[0-9]+$')],
      'receipt': [null, Validators.pattern('^[0-9]+$')],
      'reason': [],

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

  ngOnInit() {

  }

  submitForm($ev, value: any) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      console.log('Valid!');
    }
    console.log(value);
  }

  minWords(checkValue): ValidatorFn {
    return <ValidatorFn>((control: FormControl) => {
      return (control.value || '').split(' ').length >= checkValue ? null : { 'minWords': control.value };
    });
  }

  maxWords(checkValue): ValidatorFn {
    return <ValidatorFn>((control: FormControl) => {
      return (control.value || '').split(' ').length <= checkValue ? null : { 'maxWords': control.value };
    });
  }

  checkBlackList(list: Array<string>): ValidatorFn {
    return <ValidatorFn>((control: FormControl) => {
      return list.indexOf(control.value) < 0 ? null : { 'blacklist': control.value };
    });
  }
  

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.tableExp.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  fetch(cb) {    
    const req = new XMLHttpRequest();
    //req.open('GET', `assets/company.json`);
    req.open('GET', `http://localhost:8080/cmcat`);       

    req.onload = () => {      
      cb(JSON.parse(req.response));
    };
    req.send();
  }

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex)
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }


  updateFilter(event) {    
    var numPipe: PipeTransform; numPipe = this.npipe
    var datePipe: PipeTransform; datePipe = this.dpipe    
    const val = event.target.value.toLowerCase();    
    // filter our data
    const temp = this.temp.filter(function (d) {
      // return d.name.toLowerCase().indexOf(val) !== -1 || !val 
      //   || d.gender.toLowerCase().indexOf(val) !== -1 || !val
      //   || d.company.toLowerCase().indexOf(val) !== -1 || !val      
      //   || numPipe.transform(d.age) == val || !val

      return d.Desc.toLowerCase().indexOf(val) !== -1 || !val
        // || d.gender.toLowerCase().indexOf(val) !== -1 || !val
        // || d.company.toLowerCase().indexOf(val) !== -1 || !val
        // || numPipe.transform(d.age) == val || !val
    });

    // update the rows
    this.rowsFilter = temp;

    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;    
  }
  
  onSelect({ selected }) {
    console.log(this)
    console.log(this.selected)
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }
  
  getRowClass = (row) => {    
    return {
      'row-color1': row.Cnt
    };
  }

}
