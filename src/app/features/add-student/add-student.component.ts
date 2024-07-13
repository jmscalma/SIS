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


@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent implements OnInit {

  constructor(private service: AppService, private dialog: MatDialog, private router: Router, private confirmService: ConfirmationService, private message: MessageService){

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

  dataSource = new MatTableDataSource<any>();
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

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.applyFilter = debounce(this.applyFilter, 1000);
    this.civilStatusOptions = this.civilStatus.map(status => ({ label: status, value: status }));
    this.service.currentAuthenticatedUser();

    this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
  }

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
        this.dataSource.data = data.data;
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

  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.data = row;
  dialogConfig.width = '70%';  // Adjust width as needed
  dialogConfig.height = '60vh';
  dialogConfig.autoFocus = true;
  dialogConfig.position = { top: '10%', left: '20%' };
  dialogConfig.panelClass = 'custom-dialog-container';
  dialogConfig.backdropClass = 'custom-dialog-backdrop';

  const dialogRef = this.dialog.open(ViewStudentDetailsComponent, dialogConfig);

  dialogRef.afterClosed().subscribe((res) => {
    this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
  });
}

applyFilter(value: string) {
  this.keyword = value.trim().toLowerCase();
  this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
  console.log('keyword', this.keyword)
}

onPaginate(event: any) {
  this.pageNo = event.pageIndex + 1;
  this.pageSize = event.pageSize;
  this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
}

}
