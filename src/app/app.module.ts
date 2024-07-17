import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatIconModule } from '@angular/material/icon'
import { InputTextModule } from 'primeng/inputtext';
import { AppRoutingModule } from './app-routing.module';
import { PasswordModule } from 'primeng/password';
import { AppComponent } from './app.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoginComponent } from './features/auth/login/login.component';
import { ButtonModule } from 'primeng/button';
import { AddStudentComponent } from './features/add-student/add-student.component';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ForceChangePasswordComponent } from './features/auth/force-change-password/force-change-password.component';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { StepperModule } from 'primeng/stepper';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmDialogueComponent } from './features/confirmation-dialogue/confirm-dialogue/confirm-dialogue.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AuthModule } from './features/auth/auth.module';
import { ViewStudentDetailsComponent } from './features/view-student-details/view-student-details.component';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import { MatCardActions } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataTablesModule } from 'angular-datatables';
import { MatFormField } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
// import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatCard } from '@angular/material/card';
import { PaginatorModule } from 'primeng/paginator';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MainDashboardComponent } from './features/main-dashboard/main-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddStudentComponent,
    ForceChangePasswordComponent,
    ConfirmDialogueComponent,
    ViewStudentDetailsComponent,
    MainDashboardComponent
  ],
  imports: [
    MatFormField,
    MatSortModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDividerModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatStepperModule,
    PasswordModule,
    DataTablesModule,
    MatFormFieldModule,
    MatCardActions,
    MatPaginatorModule,
    MatCardModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    DialogModule,
    DynamicDialogModule,
    CalendarModule,
    RadioButtonModule,
    InputTextareaModule,
    InputMaskModule,
    DividerModule,
    ToastModule,
    DropdownModule,
    ToolbarModule,
    SplitButtonModule,
    TableModule,
    StepperModule,
    CheckboxModule,
    TooltipModule,
    HttpClientModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    CoreModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    AuthModule,
    MatTableModule,
    PaginatorModule
  ],
  providers: [MessageService, ConfirmationService, provideAnimationsAsync(), provideNativeDateAdapter(), DialogService, DynamicDialogRef, DynamicDialogConfig],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
