import { AbstractControl, ValidatorFn, Validators, FormControl, ValidationErrors } from '@angular/forms';

//---------------------------------------------------------------------------------------------------------------------------

//validator for supplier name that will accept only alpha and '-'. max of 50 characters
export function NameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value || !/^[A-Za-z-\s]{1,50}$/.test(value)) {
      return { invalidName: true }; // Invalid
    }
    return null; // Valid
  };
}

//---------------------------------------------------------------------------------------------------------------------------

//validator for cellphone number that will accept only numerical, minimum of 10, and max of 12.
export function PhoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (/^\d{10,12}$/.test(value)) {
      return null; // Valid
    }
    return { invalidPhoneNumber: true }; // Invalid
  };
}


//validator for supplier address that allows alphanumeric characters, spaces, dashes, dots, commas, hash symbols, and slashes in the address.
export function AddressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    // Check if the value is provided and does not contain potentially harmful characters
    if (!value || /^[a-zA-Z0-9\s\-\.,#\/]+$/.test(value)) {
      return null; // Valid
    }

    return { invalidSupplier: true }; // Invalid
  };
}

//---------------------------------------------------------------------------------------------------------------------------

//validator for password containing a mix of uppercase and lowercase letters, numbers, and special characters
export function StrongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.value as string;

    if (!password) {
      return null; // Return null if the password is not provided
    }

    // Regular expressions for password strength criteria
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    const isValid = hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter;

    // If the password meets all criteria, return null (valid), otherwise return an error object
    // return isValid ? null : { 'invalidPassword': true };
    if (isValid) {
        console.log('valid password')
        return null; // Valid
      }

    console.log('invalid password')
    return { 'invalidPassword': true }; // Invalid
  };

}

