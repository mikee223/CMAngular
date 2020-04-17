import { LayoutComponent } from '../layout/layout.component';

export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'masterdata', loadChildren: './masterdata/masterdata.module#MasterdataModule' }
        ]
    },

    // Not found
    { path: '**', redirectTo: 'home' }

];
