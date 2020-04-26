import { Component, OnInit, ViewEncapsulation, ViewChild, PipeTransform, ElementRef  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DecimalPipe, DatePipe } from '@angular/common';
import { _CMCategory } from './cmcategory';
const swal = require('sweetalert');

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

  constructor(private npipe: DecimalPipe, private dpipe: DatePipe, fb: FormBuilder, private el: ElementRef) {    


    let password = new FormControl('', Validators.required);
    let certainPassword = new FormControl('', CustomValidators.equalTo(password));
    
    // this.fetch((data) => {
    //   // cache our list      
    //   this.temp = _clone(data);
    //   this.rows = _clone(data);
    //   this.rowsFilter = _clone(data);
    //   this.rowsExp = _clone(data);
    //   this.rowsSort = _clone(data);
    //   this.rowsSel = _clone(data);
    // });
    this.LoadCategory()
    // Model Driven validation
    this.valForm = fb.group({
      'code': [null, Validators.pattern('^[0-9]+$')],
      'desc': [null, Validators.required],
      'count': [null, [Validators.pattern('^[0-9]+$'),Validators.required]],
      'category': [null, [Validators.pattern('^[0-9]+$'), Validators.required]],
      'receipt': [null, [Validators.pattern('^[0-9]+$'), Validators.required]],
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

  LoadCategory() {
    this.fetch((data) => {
      // cache our list      
      this.temp = _clone(data);
      this.rows = _clone(data);
      this.rowsFilter = _clone(data);
      this.rowsExp = _clone(data);
      this.rowsSort = _clone(data);
      this.rowsSel = _clone(data);
    });    
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
    req.open('GET', `http://192.168.1.165:8080/cmcat`);       

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
    const jsonData = this.selected    
    // console.log(jsonData[0].Code)
    // this.valForm.setValue['Code'].setValue(jsonData[0].Code)
    this.valForm.setValue({      
      'code': jsonData[0].Code,
      'desc': jsonData[0].Desc,
      'count': jsonData[0].Cnt,
      'category': jsonData[0].Category,
      'receipt': jsonData[0].Rcpt,
      'reason': jsonData[0].Reason
    })

  }

  onActivate(event) {
    console.log('Activate Event', event);
  }
  
  getRowClass = (row) => {
    // return {
    //   'row-color1': row.Cnt == 1
    // };
  }

  btnNewClick() {    
    this.valForm.reset()        
    const obj = this.el.nativeElement.querySelector('[formcontrolname="desc"]')
    obj.focus();
  }
  
  submitForm($ev, value: any) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      swal({
        title: 'Post Category?',
        text: '',
        icon: 'warning',
        buttons: {          
          confirm: {
            text: 'Yes',
            value: true,
            visible: true,
            className: "bg-success",
            closeModal: false
          },
          cancel: {
            text: 'Cancel',
            value: null,
            visible: true,
            className: "bg-danger",
            closeModal: false
          }
        }
      }).then((isConfirm) => {
        if (isConfirm) {          
          // console.log(this.valForm.value)
          const req = new XMLHttpRequest();
          // req.open('POST', `http://localhost:8080/cmcatpost`, /* async = */ false);          
          req.open('POST', `http://192.168.1.165:8080/api/cmcatpost`, /* async = */ false);
          req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");          
          req.send(JSON.stringify(this.valForm.value));

          console.log(req.status)
          if (req.status == 200) {
            swal('Posting Success', 'success');
            swal("Posted Successfully!", "", "success");

            this.LoadCategory()
          } else {
            swal('Cancelled', req.responseText, 'error');
          }
          

        } else {
          swal('Cancelled', 'Posting Cancelled', 'error');
        }
      });
    }    
  }

}
