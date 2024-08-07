import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { debounce } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ViewStudentDetailsComponent } from '../view-student-details/view-student-details.component';
// import { DataSource } from 'primeng/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Validators } from '@angular/forms';
import { AddressValidator,
         NameValidator,
         PhoneNumberValidator,
         EmailValidator,
         LastSchoolAttendedValidator
       } from '../../shared/validators/validators';
import { FormBuilder } from '@angular/forms';
import { ERROR_MESSAGES } from '../../shared/constants/constants';
import { ErrorDialogComponent } from '../../shared/dialog/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from '../../shared/dialog/success-dialog/success-dialog.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent implements OnInit {

  constructor(private dialogService: DialogService,
              private service: AppService,
              private authService: AuthService,
              private dialog: MatDialog,
              private router: Router,
              private confirmService: ConfirmationService,
              private message: MessageService,
              private _formBuilder: FormBuilder,){
  }

  displayedSupplies: any[] = [
    'student_name',
    'address',
    'contact_no',
    'email',
    'civil_status',
    'emergency_contact_no',
    'last_school_attended',
    'status',
  ];

  ref: DynamicDialogRef | undefined;
  dataSource: any[] = [];
  items!: MenuItem[];
  civilStatus: string[] = ['Single', 'Married', 'Widowed', 'Separated'];
  listOfRequirements: any[] = [];
  selectedStatus!: any;
  civilStatusOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Married', value: 'married' },
  ];
  visible: boolean = false;
  completename!: string;
  fulladdress!: string;
  contactno!: string;
  email!: string;
  emergencycontactno!: string;
  schoolattended!: string;
  pageNo: number = 1;
  pageSize: number = 5;
  total: number = 0;
  dataFiles: any;
  keyword: string = '';
  existingStudents: any[] = [];
  sortField: string = 'student_name';  // Default sort field
  sortOrder: number = 1;  // Default sort order (1 for ascending, -1 for descending)
  rowsPerPageOptions: number[] = [5, 10, 20, 50];
  LoginId: any = localStorage.getItem('CognitoIdentityServiceProvider.284g4btkfvbd4odhdon8o0niuj.LastAuthUser')

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.applyFilter = debounce(this.applyFilter, 1000);
    this.civilStatusOptions = this.civilStatus.map(status => ({ label: status, value: status }));
    this.authService.currentAuthenticatedUser();
    this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
  }

  //error message
  invalidAddress = ERROR_MESSAGES.invalidAddress;
  invalidName = ERROR_MESSAGES.invalidName;
  invalidPhoneNumber = ERROR_MESSAGES.invalidPhoneNumber;
  invalidEmail = ERROR_MESSAGES.invalidEmail;
  invalidLastSchoolAttended = ERROR_MESSAGES.invalidLastSchoolAttended;

  //form groups
  piForm =  this._formBuilder.group({
    cnCtrl: ['', [Validators.required, NameValidator()]],
    caCtrl: ['', [Validators.required, AddressValidator]],
    pnCtrl: ['', [Validators.required, PhoneNumberValidator]],
    eaCtrl: ['', [Validators.required, Validators.email, EmailValidator]],
    ecCtrl: ['', [Validators.required, PhoneNumberValidator]],
    csCtrl: ['', Validators.required],
    lsaCtrl: ['', [Validators.required, LastSchoolAttendedValidator]]

  });

  getAllStudents(pageNo: number, pageSize: number, keyword: string) {
    this.service.jwttoken = String(sessionStorage.getItem('IdToken'));
    this.service.getAllStudent(pageNo, pageSize, keyword).subscribe(
      (response: any) => {
        if (response && response.data && response.data.length > 0) {
          const [studentsData, totalData] = response.data;
          this.dataFiles = studentsData;
          this.existingStudents = studentsData; // Store existing students

          if (totalData && totalData.length > 0 && totalData[0].total) {
            this.total = totalData[0].total;
          } else {
            this.total = 0; // Handle case where total is not present
          }

          this.dataSource = studentsData;

          // Apply sorting if sort field is set
          if (this.sortField) {
            this.sortData();
          }
        } else {
          this.dataSource = [];
          this.total = 0; // Handle case where data is not present
        }
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }


  showDialog() {
    this.visible = true;
  }

  addStudent() {

    // Check for duplicate email
    const emailExists = this.existingStudents.some(student => student.email === this.email);

    if (emailExists) {
      this.showErrorDialog('Email address already exists. Please use a different email.');
      return; // Prevent adding the student
    }

    const regdata = {
      "student_name": this.piForm.get('cnCtrl')?.value,
      "address": this.piForm.get('caCtrl')?.value,
      "contact_no": this.piForm.get('pnCtrl')?.value,
      "email": this.piForm.get('eaCtrl')?.value,
      "civil_status": this.piForm.get('csCtrl')?.value,
      "emergency_contact_no": this.piForm.get('ecCtrl')?.value,
      "last_school_attended": this.piForm.get('lsaCtrl')?.value,
      "created_by": this.LoginId,
    };

    this.service.addStudent(regdata).subscribe(
      (data) => {
        this.successDialog();
        this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
        this.piForm.reset();
      },
      (error) => {
        console.error('Error adding student:', error);
        this.showErrorDialog('Failed to add student');
      }
    );
  }

successDialog() {
this.dialogService.open(SuccessDialogComponent, {
  header: 'Success',
  width: '30%',
  height: '30%',
  modal: true,
  closable: false
});
// Close the dialog after 2 seconds (or any other logic you prefer)
setTimeout(() => {
  if (this.ref) {
    this.ref.close();
  }
}, 1000); // Adjust time as necessary
}


showErrorDialog(errorMessage: string) {
  const ref = this.dialogService.open(ErrorDialogComponent, {
    data: { message: errorMessage },
    header: 'Error',
    width: '25%',
    height: '40%'
  });
}

getStudentDetails(row: any) {
  this.service.student_id = row.student_id;
  const dialogRef = this.dialogService.open(ViewStudentDetailsComponent, {
    data: row,
    header: 'Student Details',
    width: '70%',
    height: '60vh'
  });

  dialogRef.onClose.subscribe((res) => {
    this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
  });
}

applyFilter(value: string) {
  this.keyword = value.trim().toLowerCase();
  this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
}

onPaginate(event: any) {
  this.pageNo = event.first / event.rows + 1;
  this.pageSize = event.rows;
  this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
}


sortData() {
  console.log('Sorting data...');
  console.log('Current sort field:', this.sortField);
  console.log('Current sort order:', this.sortOrder);

  this.dataSource.sort((a: any, b: any) => {
    const fieldA = a[this.sortField]?.toString().toLowerCase() || '';
    const fieldB = b[this.sortField]?.toString().toLowerCase() || '';

    console.log(`Comparing ${fieldA} with ${fieldB}`);

    const comparison = fieldA.localeCompare(fieldB);
    const sorted = this.sortOrder * comparison;

    console.log('Result of comparison:', sorted);
    return sorted;
  });

  console.log('Sorted data:', this.dataSource);
}

}
