import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStudentComponent } from './features/add-student/add-student.component';
import { AuthGuard } from './features/auth/auth.guard';
import { MainComponent } from './core/main/main.component';
import { MainDashboardComponent } from './features/main-dashboard/main-dashboard.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'dashboard', component: MainComponent, canActivate: [AuthGuard], children: [
    {path: 'main-dashboard', component: MainDashboardComponent,  canActivate: [AuthGuard]},
    {path: 'add-student', component: AddStudentComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {  }
