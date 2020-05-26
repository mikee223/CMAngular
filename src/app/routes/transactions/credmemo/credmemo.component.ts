import { Component, OnInit, ViewEncapsulation, ViewChild, PipeTransform, ElementRef  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DecimalPipe, DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
const swal = require('sweetalert');

const _clone = (d) => JSON.parse(JSON.stringify(d));

@Component({
  selector: "app-credmemo",
  templateUrl: "./credmemo.component.html",
  styleUrls: ["./credmemo.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CredmemoComponent implements OnInit {
  @ViewChild(DatatableComponent) tableCM: DatatableComponent;
  @ViewChild(DatatableComponent) tableCMList: DatatableComponent;

  cmForm: FormGroup;

  //select option variable
  categories = [];
  branches = [];
  paymodes = [];
  patienttypes = [];
  salespersons = [];
  
  columnsCM = [
    { prop: "name" },
    { name: "Code" },
    { name: "Desc" },
    { name: "Qty" },
    { name: "Amount" },
    { name: "Disc" },
    { name: "Total" },
    { name: "AdjType" },
    { name: "PriceLvl" },
    { name: "PackageNo" }
  ];

  columnsCMList = [
    // { prop: "name" },    
  ];

  //table cm
  tableCM_temp = [];
  tableCM_rowsFilter = [];
  tableCM_rows = [];
  tableCM_selected = [];

  //table cmlist
  tableCMList_temp = [];
  tableCMList_rowsFilter = [];
  tableCMList_rows = [];
  tableCMList_selected = [];

  //modals    
  @ViewChild('cmlistModal') cmlistModal: ModalDirective;
  @ViewChild('cmlistStatus') cmlistStatus: ElementRef;
  @ViewChild('cmlistSearch') cmlistSearch: ElementRef;

  isLoadingCMList = true
  isLoadingCM = true
  

  dateValid(AC: AbstractControl) {
    if (AC && AC.value && !moment(AC.value, "MM/DD/YYYY", true).isValid()) {
      return { dateVaidator: true };
    }
    return null;
  }

  constructor(fb: FormBuilder, private npipe: DecimalPipe, private dpipe: DatePipe) {
    
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
  apiSubmit = "";
  apiParam;

  api_loader(cb) {
    const req = new XMLHttpRequest();
    req.open(this.apiSubmit, this.apiurl, false);
    
    req.onload = () => {      
      if (this.apiSubmit == "POST") {
        var _jsonList = JSON.parse(req.response)        
        cb(_jsonList[0]);
      } else {
        cb(JSON.parse(req.response));
      }
      
    };

    if (this.apiParam == null) {      
      req.send();
    } else {

      req.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
      );
      
      req.send(JSON.stringify(this.apiParam));      
    }
    
  }

  //load select option -------------------------------------------------------- >
  LoadCategories() {
    this.apiSubmit = `GET`
    this.apiurl = `http://localhost:8080/cmcat`;
    this.apiParam = null
    this.api_loader((data) => {
      // cache our list
      this.categories = _clone(data);
    });
  }

  LoadBranches() {
    this.apiSubmit = `GET`
    this.apiurl = `http://localhost:8080/cmbranches`;
    this.apiParam = null
    this.api_loader((data) => {
      // cache our list
      this.branches = _clone(data);
    });
  }

  LoadPaymode() {
    this.apiSubmit = `GET`
    this.apiurl = `http://localhost:8080/cmpaymode`;
    this.apiParam = null
    this.api_loader((data) => {
      // cache our list
      this.paymodes = _clone(data);
    });
  }

  LoadPatientTypes(){
    this.apiSubmit = `GET`
      this.apiurl = `http://localhost:8080/cmpatienttype`;
      this.apiParam = null

      this.api_loader((data) => {
        // cache our list
        this.patienttypes = _clone(data);
      });
  }

  LoadSalesPersons() {
    this.apiSubmit = `GET`
    this.apiurl = `http://localhost:8080/cmsalesperson`;
    this.apiParam = null
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

  selectCMList(){

    if (this.cmlistStatus.nativeElement.value =="Open") {
      const jsonData = this.tableCMList_selected
      var _docentry = jsonData[0].BaseEntry //Invoice Number
      var _Param = { DocEntry: _docentry };
      var datePipe: PipeTransform;
      datePipe = this.dpipe

      this.apiSubmit = `POST`
      this.apiurl = `http://localhost:8080/sp/cmlabdetails`;
      this.apiParam = _Param

      this.api_loader((data) => {
        this.cmForm.setValue({
          'labno': data[0].LabNo,
          'whscode': data[0].WhsCode,
          'docdate': datePipe.transform(data[0].DocDate, "yyyy-MM-dd"),
          'docentry': data[0].DocEntry,
          'doctotal': data[0].DocTotal,
          'balance': data[0].Balance,
          'cardcode': data[0].CardCode,
          'cardname': data[0].CardName,
          'creditmemo': jsonData[0].CMDMno,
          'refno': data[0].RefNo,
          'transnum': data[0].TransNum,
          'remarks': jsonData[0].Reason,
          'soano': data[0].SoaNo,
          'soadate': datePipe.transform(data[0].SoaDate, "yyyy-MM-dd"),
          'category': jsonData[0].Category,
          'count': 0,
          'patient': data[0].Patient,
          'transdate': datePipe.transform(data[0].TransDate, "yyyy-MM-dd"),
          'paymode': data[0].PMode,
          'patienttype': data[0].PType,
          'dcode': data[0].DCode,
          'salesperson': data[0].SlpCode,
          'source': data[0].Source,
          'status': data[0].DocStatus,
          'retainlabno': jsonData[0].RetainLabNo,
        });
        this.CategoryCount() //count value
        this.cmlistModal.hide()
        this.cmlistSearch.nativeElement.value = '';
        // this.salespersons = _clone(data);

        //table details
        this.isLoadingCM = true
        this.tableCM_temp = null
        this.tableCM_rows = null
        this.tableCM_rowsFilter = null  

        setTimeout(() => {          
            this.tableCM_temp = _clone(data);
            this.tableCM_rows = _clone(data);
            this.tableCM_rowsFilter = _clone(data);
            this.isLoadingCM = false          
        }, 100);

      });    
    } else {
      swal('Restricted', 'Cannot Select Done,Cancelled and Rejected!', 'error');
    }
    

  }

  CMListSelected = [];

  SelectCMTable({ selected }){
     //const jsonData = this.CMListSelected
     console.log(selected) 
  }  
  
  //End Functions -------------------------------------------------------- >

  //Filters and Load Data

  LoadCMTable(status){    
    // this.isLoadingCM = true

    // this.tableCM_temp = null
    // this.tableCM_rows = null
    // this.tableCM_rowsFilter = null

    // setTimeout(() => {
    //   var _Param = { Stat: status };
    //   this.apiSubmit = `POST`
    //   this.apiurl = `http://localhost:8080/sp/cmlabdetails`;
    //   this.apiParam = _Param

    //   this.api_loader((data) => {
    //     // cache our list
    //     this.tableCM_temp = _clone(data);
    //     this.tableCM_rows = _clone(data);
    //     this.tableCM_rowsFilter = _clone(data);
    //     this.isLoadingCM = false
    //   });              
    // }, 100);    
  }

  FilterCMTable(event) {
    var numPipe: PipeTransform;
    numPipe = this.npipe;
    var datePipe: PipeTransform;
    datePipe = this.dpipe;
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tableCM_temp.filter(function (d) {
      return (
        d.EmpCode.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.EmpName.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        numPipe.transform(d.Done) == val ||
        !val
      );
    });
    this.tableCM_rowsFilter = temp;
    this.tableCM.offset = 0;
  }

  FilterCMList(event){
    var numPipe: PipeTransform;
    numPipe = this.npipe;
    var datePipe: PipeTransform;
    datePipe = this.dpipe;
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tableCMList_temp.filter(function (d) {
      return (
        d.DocEntry == val || !val ||
        d.LabNo.toLowerCase().indexOf(val) !== -1 || !val ||
        d.BaseEntry.toLowerCase().indexOf(val) !== -1 || !val ||
        d.CardCode.toLowerCase().indexOf(val) !== -1 || !val ||
        d.CardName.toLowerCase().indexOf(val) !== -1 || !val ||
        datePipe.transform(d.DateRec, "MM/dd/yyyy") == val || !val ||
        d.WhsCode.toLowerCase().indexOf(val) !== -1 || !val ||
        d.CMDMno.toLowerCase().indexOf(val) !== -1 || !val ||
        numPipe.transform(d.AdjAmt,'1.2-2') == val || !val ||
        numPipe.transform(d.DocTotal, '1.2-2') == val || !val ||
        d.PMode.toLowerCase().indexOf(val) !== -1 || !val ||
        d.Stat.toLowerCase().indexOf(val) !== -1 || !val ||
        d.CMApp.toLowerCase().indexOf(val) !== -1 || !val ||
        d.DocStatus.toLowerCase().indexOf(val) !== -1 || !val ||
        d.Category.toLowerCase().indexOf(val) !== -1 || !val ||
        d.EmpName.toLowerCase().indexOf(val) !== -1 || !val ||
        numPipe.transform(d.SDAmt, '1.2-2') == val || !val ||
        d.BillAppBy.toLowerCase().indexOf(val) !== -1 || !val ||
        datePipe.transform(d.BillAppDate, "MM/dd/yyyy") == val || !val ||
        d.RetainLabNo.toLowerCase().indexOf(val) !== -1 || !val ||
        d.DoneBy.toLowerCase().indexOf(val) !== -1 || !val
      );
    });
    this.tableCMList_rowsFilter = temp;
    this.tableCMList.offset = 0;
  }
  //-----

  //Load Modal Details
  LoadCMList(status){    
    this.isLoadingCMList = true

    this.tableCMList_temp = null
    this.tableCMList_rows = null
    this.tableCMList_rowsFilter = null

    setTimeout(() => {
      var _Param = { Stat: status };
      this.apiSubmit = `POST`
      this.apiurl = `http://localhost:8080/sp/cmloadcmlist`;
      this.apiParam = _Param

      this.api_loader((data) => {
        // cache our list
        this.tableCMList_temp = _clone(data);
        this.tableCMList_rows = _clone(data);
        this.tableCMList_rowsFilter = _clone(data);
        this.isLoadingCMList = false
      });              
    }, 100);    
  }


  //---------

}
