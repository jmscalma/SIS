import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from '../../app.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
// import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogueComponent } from '../confirmation-dialogue/confirm-dialogue/confirm-dialogue.component';
// import { MatDialog } from '@angular/material/dialog';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AddressValidator,
  NameValidator,
  PhoneNumberValidator,
  EmailValidator
} from '../../shared/validators/validators';
import { ERROR_MESSAGES } from '../../shared/constants/constants';

@Component({
  selector: 'app-view-student-details',
  templateUrl: './view-student-details.component.html',
  styleUrl: './view-student-details.component.css'
})
export class ViewStudentDetailsComponent implements OnInit{

  constructor(
    private service: AppService,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => (this.isSmallScreen = result.matches));
    // this.piForm();
    this.getStudentById(this.config.data.student_id);
  }

  //Variables
  civilStatusOptions: { label: string, value: string }[] = [];
  selectedStatus!: any;
  completename!: string;
  fulladdress!: string;
  contactno!: string;
  email!: string;
  studentid: any;
  isCloseHovered: boolean = false;
  isEditHovered: boolean = false;
  emergencycontactno!: string;
  schoolattended!: string;
  status: any;
  isSmallScreen: boolean = false;
  ispiFormEditable: boolean = true;
  isliFormEditable: boolean = true;
  iscredsFormEditable: boolean = true;
  isEditable: boolean = false;
  isNotEditable: boolean = false;
  isEnableHovered: boolean = false;
  isDisableHovered: boolean = false;
  errorMessage: any;

   //error message
   invalidAddress = ERROR_MESSAGES.invalidAddress;
   invalidName = ERROR_MESSAGES.invalidName;
   invalidPhoneNumber = ERROR_MESSAGES.invalidPhoneNumber;
   invalidEmail = ERROR_MESSAGES.invalidEmail;

   //form group
   piForm =  this.formBuilder.group({
    snCtrl: [{ value: '', disabled: !this.isEditable }, [Validators.required, NameValidator]],
    aCtrl: [{ value: '', disabled: !this.isEditable }, [Validators.required, AddressValidator]],
    cnCtrl: [{ value: '', disabled: !this.isEditable }, [Validators.required, PhoneNumberValidator]],
    eCtrl: [{ value: '', disabled: !this.isEditable }, [Validators.required, EmailValidator]],
    ecnCtrl: [{ value: '', disabled: !this.isEditable }, [Validators.required, PhoneNumberValidator]],
    lsaCtrl: [{ value: '', disabled: !this.isEditable }, [Validators.required, AddressValidator]],
  });

  closeDialog(){
    this.ref.close()
  }

  isEditableBtn(): void {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.piForm.enable();
    } else {
      this.piForm.disable();
    }
  }

  getStudentById(studentId: number) {
    console.log('Fetching student details for ID:', studentId);

    // Simulate API call or logic to fetch additional student details based on studentId
    // Replace with actual API call based on your service implementation
    this.service.getStudentById(studentId).subscribe(
      (data) => {
        console.log('API Response:', data);
        this.studentid = data.data[0].student_id;
        this.completename = data.data[0].student_name;
        this.fulladdress = data.data[0].address;
        this.contactno = data.data[0].contact_no;
        this.email = data.data[0].email;
        this.emergencycontactno = data.data[0].emergency_contact_no;
        this.schoolattended = data.data[0].last_school_attended;
        this.status = data.data[0].status;

        this.piForm.patchValue({
          snCtrl: this.completename,
          aCtrl: this.fulladdress,
          cnCtrl: this.contactno,
          eCtrl: this.email,
          ecnCtrl: this.emergencycontactno,
          lsaCtrl: this.schoolattended,
        });

        console.log('Fetched student details:', data);
      },
      (error) => {
        console.error('Error fetching student details:', error);
        this.errorMessage = 'Could not load user, please try again.';
      }
    );
  }

  editStudentDetails(reverseButtons: boolean) {
    this.ref = this.dialogService.open(ConfirmDialogueComponent, {
      width: '250px',
      data: { title: 'Confirm Update', message: 'Are you sure you want to update this supllies details?', reverseButtons: reverseButtons  }

    });

   this.ref.onClose.subscribe((result: boolean) => {
    if (result) {

      let id = this.service.student_id;
      this.ispiFormEditable = false;
      this.isliFormEditable = false;
      this.iscredsFormEditable = false;

      const studentName = this.piForm.get('snCtrl')?.value;
      const address = this.piForm.get('aCtrl')?.value;
      const contactNumber = this.piForm.get('cnCtrl')?.value;
      const email = this.piForm.get('eCtrl')?.value;
      const emergencyContact = this.piForm.get('ecnCtrl')?.value;
      const lastSchoolAttended = this.piForm.get('lsaCtrl')?.value;

      const regdata = {
        student_name: studentName,
        address: address,
        contact_no: contactNumber,
        email: email,
        emergency_contact_no: emergencyContact,
        last_school_attended: lastSchoolAttended,
        student_id: this.studentid,
      };

      console.log(regdata, "regdata");

      this.service.updateStudentDetails(regdata).subscribe(
        (data) => {
          if (data.message === 'No changes made.') {
            // this.openErrorDialog(data.message);
          } else {
            // this.openSuccessDialog();
            this.ref.close()
          }
        },
        (error) => {
          const errorMessage = error.error ? error.error.message : 'Something went wrong';
          // this.openErrorDialog(errorMessage);
        }
      );
    }
  });
}

disableStudentById(reverseButtons:boolean){
  this.ref = this.dialogService.open(ConfirmDialogueComponent, {
    width: '250px',
    data: { title: 'Confirm Update', message: 'Are you sure you want to deactivate this student?', reverseButtons: reverseButtons }
  });

  this.ref.onClose.subscribe((result: boolean) => {
    if (result) {
  let id = this.service.student_id;

  this.service.disableStudent(id).subscribe((data) => {
    console.log(data)
    // this.openSuccessDialog();
    this.ref.close();
  });
}
});
}

enableCustomerById(reverseButtons:boolean){
  this.ref = this.dialogService.open(ConfirmDialogueComponent, {
    width: '250px',
    data: { title: 'Confirm Update', message: 'Are you sure you want to activate this student?', reverseButtons: reverseButtons }
  });

  this.ref.onClose.subscribe((result: boolean) => {
    if (result) {
  let id = this.service.student_id;

  this.service.activateStudent(id).subscribe((data) => {
    console.log(data)
    // this.openSuccessDialog();
    this.ref.close();
  });
 }
});
 }


}
