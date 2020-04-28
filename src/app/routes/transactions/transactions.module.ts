import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Ng2TableModule } from "ng2-table/ng2-table";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "../../shared/shared.module";

import { CredmemoComponent } from "./credmemo/credmemo.component";

const routes: Routes = [
  { path: "credmemo", component: CredmemoComponent },
  { path: "**", redirectTo: "credmemo" },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    //Ng2TableModule,
    NgxDatatableModule,
  ],
  declarations: [CredmemoComponent],
  exports: [RouterModule],
})
export class TransactionsModule {}

