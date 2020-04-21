import { Component, OnInit, ViewEncapsulation, ViewChild, PipeTransform, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DecimalPipe, DatePipe } from '@angular/common';


const _clone = (d) => JSON.parse(JSON.stringify(d));

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {
    @ViewChild(DatatableComponent) tableCount: DatatableComponent;

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

    columnsCount = [
        { prop: 'name' },
        { name: 'Employee' },
        { name: 'Count' },
        { name: 'Percentage' }
    ];

    constructor(private npipe: DecimalPipe, private dpipe: DatePipe) { 
        this.LoadDBCount()
    }

    ngOnInit() {
    }

    fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', `http://192.168.1.165:8080/cmdbcount`);

        req.onload = () => {
            cb(JSON.parse(req.response));
        };
        req.send();
    }

    //load
    LoadDBCount() {
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

    FilterDBCount(event) {
        var numPipe: PipeTransform; numPipe = this.npipe
        var datePipe: PipeTransform; datePipe = this.dpipe
        const val = event.target.value.toLowerCase();
        // filter our data
        const temp = this.temp.filter(function (d) {            
            return d.EmpCode.toLowerCase().indexOf(val) !== -1 || !val
                || d.EmpName.toLowerCase().indexOf(val) !== -1 || !val
                || numPipe.transform(d.Done) == val || !val            
        });        
        this.rowsFilter = temp;        
        this.tableCount.offset = 0;
    }


}
