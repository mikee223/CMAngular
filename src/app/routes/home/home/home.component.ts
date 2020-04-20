import { Component, OnInit, ViewEncapsulation, ViewChild, PipeTransform, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    @ViewChild(DatatableComponent) tableCount: DatatableComponent;

    columnsCount = [
        { prop: 'name' },
        { name: 'Employee' },
        { name: 'Count' },
        { name: 'Percentage' }
    ];

    constructor() { }

    ngOnInit() {
    }

    clicked(){
        console.log('hey')
    }

}
