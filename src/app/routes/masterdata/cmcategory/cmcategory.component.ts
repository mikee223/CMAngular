import { Component, OnInit, ViewEncapsulation, ViewChild, PipeTransform  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
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
     { name: 'Cnt' },
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

  // columns = [
  //   { prop: 'name' },
  //   { name: 'Company' },
  //   { name: 'Gender' }
  // ];
  
  // columnsSort = [
  //   { prop: 'name' },
  //   { name: 'Company' },
  //   { name: 'Gender' }
  // ];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('myTable') tableExp: any;

  constructor(private npipe: DecimalPipe,private dpipe: DatePipe) {    
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

    ngOnInit() {

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
}
