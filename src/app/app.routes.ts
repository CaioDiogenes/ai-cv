import { Routes } from '@angular/router';
import { ResultComponent } from '../result/result.component';
import { FormComponent } from '../form/form.component';

export const routes: Routes = [
    { path: '', component: FormComponent },
    { path: 'resultado', component: ResultComponent },
    { path: '**', redirectTo: '' },

];
