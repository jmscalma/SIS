import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { signOut } from 'aws-amplify/auth';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AppService } from '../../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounce } from 'lodash';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewStudentDetailsComponent } from '../view-student-details/view-student-details.component';
// import { DataSource } from 'primeng/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogueComponent } from '../confirmation-dialogue/confirm-dialogue/confirm-dialogue.component';
import { Validators } from '@angular/forms';
import { AddressValidator,
         NameValidator,
         PhoneNumberValidator,
         EmailValidator
       } from '../../shared/validators/validators';
import { FormBuilder } from '@angular/forms';
import { ERROR_MESSAGES } from '../../shared/constants/constants';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent implements OnInit {

  constructor(private dialogService: DialogService,
              private service: AppService,
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
  civilStatusOptions: { label: string, value: string }[] = [];
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
  mockUserId = 2;
  sortField: string = 'student_name';  // Default sort field
  sortOrder: number = 1;  // Default sort order (1 for ascending, -1 for descending)
  rowsPerPageOptions: number[] = [5, 10, 20, 50];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.applyFilter = debounce(this.applyFilter, 1000);
    this.civilStatusOptions = this.civilStatus.map(status => ({ label: status, value: status }));
    this.service.currentAuthenticatedUser();
    this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
  }

  //error message
  invalidAddress = ERROR_MESSAGES.invalidAddress;
  invalidName = ERROR_MESSAGES.invalidName;
  invalidPhoneNumber = ERROR_MESSAGES.invalidPhoneNumber;
  invalidEmail = ERROR_MESSAGES.invalidEmail;
  //form groups
  piForm =  this._formBuilder.group({

    cnCtrl: ['', [Validators.required, NameValidator()]],
    caCtrl: ['', [Validators.required, AddressValidator]],
    pnCtrl: ['', [Validators.required, PhoneNumberValidator]],
    eaCtrl: ['', [Validators.required, Validators.email, EmailValidator]],
    ecCtrl: ['', [Validators.required, PhoneNumberValidator]],
    lsaCtrl: ['', [Validators.required, AddressValidator]]

  });

  logoutBtn(event: Event) {
    this.confirmService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to logout?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.message.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        },
        reject: () => {
            this.message.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

  logout() {
    this.service.handleSignOut().then (() =>{
      this.router.navigate(['/login']);
    }).catch((error)=>{
      console.log ("something went wrong")
    });
  }

  getAllStudents(pageNo: number, pageSize: number, keyword: string) {
    this.service.getAllStudent(pageNo, pageSize, keyword)
      .subscribe((data: any) => {
        this.dataFiles = data.data;
        this.total = data.total;
        this.dataSource = data.data;
        this.service.search = data.result;
        console.log('keyword', keyword)
      });
  }

  showDialog() {
    this.visible = true;
  }

addStudent(){

  const regdata = {
    "student_name": this.completename,
    "address": this.fulladdress,
    "contact_no": this.contactno,
    "email": this.email,
    "civil_status": this.selectedStatus,
    "emergency_contact_no": this.emergencycontactno,
    "last_school_attended": this.schoolattended,
    "created_by": String(this.mockUserId)
  }

  this.service.addStudent(regdata).subscribe(
    (data) => {
      console.log(regdata)
    }
  )
}

getStudentDetails(row: any) {
  console.log('row', row);
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
  console.log('keyword', this.keyword)
}

onPaginate(event: any) {
  this.pageNo = event.first / event.rows + 1;
  this.pageSize = event.rows;

  this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
  console.log('Pagination is working', this.pageSize, this.pageSize)
}

onSort(event: any) {
  this.sortField = event.field;
  this.sortOrder = event.order === 1 ? 1 : -1;  // PrimeNG order: 1 for ascending, -1 for descending
  this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
}
}
