import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from '../../app.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../shared/dialog/confirm-dialog/confirm-dialog.component';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AddressValidator,
  NameValidator,
  PhoneNumberValidator,
  EmailValidator
} from '../../shared/validators/validators';
import { ERROR_MESSAGES } from '../../shared/constants/constants';
import { SuccessDialogComponent } from '../../shared/dialog/success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../../shared/dialog/error-dialog/error-dialog.component';

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
  ) {
    console.log("DialogRef:", this.ref);
    console.log("DialogConfig:", this.config);
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => (this.isSmallScreen = result.matches));
    // this.piForm();
    this.getStudentById(this.config.data.student_id);
  }

  //Variables
  civilStatusOptions: { label: string, value: string }[] = [];
  civilStatus: string[] = ['Single', 'Married', 'Widowed', 'Separated'];
  selectedStatus!: any;
  completename!: string;
  fulladdress!: string;
  contactno!: string;
  email!: string;
  civilstatus!: string;
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
  LoginId: any = localStorage.getItem('CognitoIdentityServiceProvider.284g4btkfvbd4odhdon8o0niuj.LastAuthUser')


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
    csCtrl: [{ value: '', disabled: !this.isEditable }, [Validators.required]],
    lsaCtrl: [{ value: '', disabled: !this.isEditable }, [Validators.required, AddressValidator]],
  });

  closeDialog() {
    console.log("Closing dialog", this.ref);
    if (this.ref) {
      this.ref.close();
    } else {
      console.error("DynamicDialogRef is not available");
    }
  }

  isEditableBtn(): void {
    if (this.status !== 'Disabled') {
      this.isEditable = !this.isEditable;
      if (this.isEditable) {
        this.piForm.enable();
      } else {
        this.piForm.disable();
      }
    }
  }

  populateCivilStatusOptions() {
    this.civilStatusOptions = this.civilStatus.map(status => ({ label: status, value: status }));
  }

  getStudentById(studentId: number) {
    console.log('Fetching student details for ID:', studentId);

    this.service.getStudentById(studentId).subscribe(
      (data) => {
        console.log('API Response:', data);
        this.studentid = data.data[0][0].student_id;
        this.completename = data.data[0][0].student_name;
        this.fulladdress = data.data[0][0].address;
        this.contactno = data.data[0][0].contact_no;
        this.email = data.data[0][0].email;
        this.civilstatus = data.data[0][0].civil_status;
        this.emergencycontactno = data.data[0][0].emergency_contact_no;
        this.schoolattended = data.data[0][0].last_school_attended;
        this.status = data.data[0][0].status;

        this.piForm.patchValue({
          snCtrl: this.completename,
          aCtrl: this.fulladdress,
          cnCtrl: this.contactno,
          eCtrl: this.email,
          ecnCtrl: this.emergencycontactno,
          csCtrl: this.civilstatus,
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
    const confirmDialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: '360px',
      data: { title: 'Confirm Update', message: 'Are you sure you want to update this student details?', reverseButtons: reverseButtons  }

    });

   confirmDialogRef.onClose.subscribe((result: boolean) => {
    if (result) {

      let id = this.service.student_id;
      this.ispiFormEditable = false;
      this.isliFormEditable = false;
      this.iscredsFormEditable = false;

      const studentName = this.piForm.get('snCtrl')?.value;
      const address = this.piForm.get('aCtrl')?.value;
      const contactNumber = this.piForm.get('cnCtrl')?.value;
      const email = this.piForm.get('eCtrl')?.value;
      const civilstatus = this.piForm.get('csCtrl')?.value;
      const emergencyContact = this.piForm.get('ecnCtrl')?.value;
      const lastSchoolAttended = this.piForm.get('lsaCtrl')?.value;

      const regdata = {
        student_name: studentName,
        address: address,
        contact_no: contactNumber,
        email: email,
        civil_status: civilstatus,
        emergency_contact_no: emergencyContact,
        last_school_attended: lastSchoolAttended,
        student_id: this.studentid,
      };

      console.log(regdata, "regdata");

      this.service.updateStudentDetails(regdata).subscribe(
        (data) => {
          if (data.message === 'Could not update student, please try again.') {
            console.log('Update Failed')
            this.showErrorDialog('Failed to update student. Please Try Again')
          } else {
            this.showDialog();
            this.closeDialog();
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

disableStudentById(reverseButtons: boolean) {
  const confirmDialogRef = this.dialogService.open(ConfirmDialogComponent, {
    header: 'Update Confirmation',
    width: '360px',
    data: { message: 'Are you sure you want to deactivate this student?', reverseButtons: reverseButtons }
  });

  const regdata = {

    disabled_by: this.LoginId
  }

confirmDialogRef.onClose.subscribe((result: boolean) => {
    if (result) {
      let id = this.service.student_id;
      this.service.disableStudent(id, regdata).subscribe((data) => {
        console.log('Disable Response:', data);
        this.showDialog();
        this.closeDialog();
      });
    }
  });
}

enableCustomerById(reverseButtons: boolean) {
  const confirmDialogRef = this.dialogService.open(ConfirmDialogComponent, {
    header: 'Update Confirmation',
    width: '360px',
    data: { message: 'Are you sure you want to activate this student?', reverseButtons: reverseButtons }
  });

  confirmDialogRef.onClose.subscribe((result: boolean) => {
    if (result) {
      let id = this.service.student_id;
      this.service.activateStudent(id).subscribe((data) => {
        console.log('Activate Response:', data);
        this.showDialog();
        this.closeDialog();
      });
    }
  });
}

 showDialog() {
  this.dialogService.open(SuccessDialogComponent, {
    header: 'SUCCESS',
    width: '20%',
    height: '30%'
  });
}

showErrorDialog(errorMessage: string) {
  const ref = this.dialogService.open(ErrorDialogComponent, {
    data: { message: errorMessage },
    header: 'Error',
    width: '25%',
    height: '40%'
  });
}

}
