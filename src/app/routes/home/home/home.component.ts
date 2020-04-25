import { Component, OnInit, ViewEncapsulation, ViewChild, PipeTransform, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';


const _clone = (d) => JSON.parse(JSON.stringify(d));

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None
})


export class HomeComponent implements OnInit {
    @ViewChild(DatatableComponent) tableCount : DatatableComponent;
    @ViewChild(DatatableComponent) tableReport: DatatableComponent;
    @ViewChild(DatatableComponent) tableCategory: DatatableComponent;

    // unknown usage
    editing = {};
    rowsExp = [];
    rowsSort = [];
    expanded: any = {};
    timeout: any;
    rowsSel = [];

    constructor(private npipe: DecimalPipe, private dpipe: DatePipe, private exportAsService: ExportAsService, private el: ElementRef) { 
        
    }

    ngOnInit() {
        this.LoadDBCount();
        this.LoadDBReport();
        this.LoadDBCategory();
    }

    columnsCount = [
        { prop: 'name' },
        { name: 'Employee' },
        { name: 'Count' },
        { name: 'Percentage' }
    ];

    columnsReport = [
        { prop: 'name' },
        { name: 'Dt' },
        { name: 'Pending' },
        { name: 'New' },
        { name: 'Done' }
    ];

    columnsCategory = [
        { prop: 'name' },
        { name: 'Category' },
        { name: 'Cnt' },
        { name: 'Perc' }        
    ];

    //table count
    tableCount_temp = [];
    tableCount_rowsFilter = [];
    tableCount_rows = [];
    tableCount_selected = [];

    //table report
    tableReport_temp = [];
    tableReport_rowsFilter = [];
    tableReport_rows = [];
    tableReport_selected = [];

    //table category
    tableCategory_temp = [];
    tableCategory_rowsFilter = [];
    tableCategory_rows = [];
    tableCategory_selected = [];
    

    //api variable
    apiurl = "";
    
    //api loader (GET ONLY)
    api_loader(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', this.apiurl, false);
        req.onload = () => {
            cb(JSON.parse(req.response));
        };
        req.send();
    }

    //load
    LoadDBCount() {
        this.apiurl = `http://192.168.1.165:8080/cmdbcount`
        this.api_loader((data) => {
            // cache our list      
            this.tableCount_temp = _clone(data);
            this.tableCount_rows = _clone(data);            
            this.tableCount_rowsFilter = _clone(data);
            // this.rowsExp = _clone(data);
            // this.rowsSort = _clone(data);
            // this.rowsSel = _clone(data);
        });
    }    

    LoadDBReport() {
        this.apiurl = `http://192.168.1.165:8080/cmdbreport`
        this.api_loader((data) => {
            // cache our list      
            this.tableReport_temp = _clone(data);
            this.tableReport_rows = _clone(data);
            this.tableReport_rowsFilter = _clone(data);
            // this.rowsExp = _clone(data);
            // this.rowsSort = _clone(data);
            // this.rowsSel = _clone(data);
        });
    }

    LoadDBCategory() {
        this.apiurl = `http://192.168.1.165:8080/cmdbcategory`
        this.api_loader((data) => {
            // cache our list      
            this.tableCategory_temp = _clone(data);
            this.tableCategory_rows = _clone(data);
            this.tableCategory_rowsFilter = _clone(data);
        });
    }

    //filter (search)
    FilterDBCount(event) {
        var numPipe: PipeTransform; numPipe = this.npipe
        var datePipe: PipeTransform; datePipe = this.dpipe
        const val = event.target.value.toLowerCase();
        // filter our data
        const temp = this.tableCount_temp.filter(function (d) {            
            return d.EmpCode.toLowerCase().indexOf(val) !== -1 || !val
                || d.EmpName.toLowerCase().indexOf(val) !== -1 || !val
                || numPipe.transform(d.Done) == val || !val
        });        
        this.tableCount_rowsFilter = temp;        
        this.tableCount.offset = 0;
    }

    FilterDBReport(event) {
        var numPipe: PipeTransform; numPipe = this.npipe
        var datePipe: PipeTransform; datePipe = this.dpipe
        const val = event.target.value.toLowerCase();
        // filter our data

        const temp = this.tableReport_temp.filter(function (d) {            
            return datePipe.transform(d.Dt,'MM/dd/yyyy') == val || !val ||
                   numPipe.transform(d.Pending) == val || !val ||
                   numPipe.transform(d.New) == val || !val ||
                   numPipe.transform(d.Done) == val || !val
        });
        this.tableReport_rowsFilter = temp;
        this.tableReport.offset = 0;
    }

    FilterDBCategory(event) {
        var numPipe: PipeTransform; numPipe = this.npipe
        var datePipe: PipeTransform; datePipe = this.dpipe
        const val = event.target.value.toLowerCase();
        // filter our data

        const temp = this.tableCategory_temp.filter(function (d) {
            return d.Category.toLowerCase().indexOf(val) !== -1 || !val
                || numPipe.transform(d.Cnt) == val || !val                
                || numPipe.transform(d.Perc) == val || !val
        });

        this.tableCategory_rowsFilter = temp;
        this.tableCategory.offset = 0;
    }


   //export file
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'element',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }
    };

    exportAs(type: SupportedExtensions, opt?: string) {
        
        this.config.type = type;        
        if (opt) {
            this.config.options.jsPDF.orientation = opt;
        }        
        this.exportAsService.save(this.config, 'File').subscribe(() => {            
            // save started            
        });   
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
        }
    }

    

}
