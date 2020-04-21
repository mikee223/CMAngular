import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';

import { CmcategoryComponent } from './cmcategory/cmcategory.component';

const routes: Routes = [
  { path: 'category', component: CmcategoryComponent },
  { path: '**', redirectTo: 'category' }
];

@NgModule({  
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    Ng2TableModule,
    NgxDatatableModule
  ],
  declarations: [CmcategoryComponent],
  exports: [
    RouterModule
  ]
})

export class MasterdataModule { }
