interface ErrorMessages {

  invalidPassword: string;
  invalidName: string;
  invalidAddress: string;
  invalidPhoneNumber: string;
  invalidEmail: string;
}

const errorMessages: ErrorMessages = {
  invalidPassword: 'Must contain uppercase, lowercase letters, numbers, and special characters.',
  invalidName: 'Must contain only letters and dashes, maximum 50 characters.',
  invalidAddress: 'Can only contain letters, numbers, spaces, dashes, dots, commas, hash symbols, and slashes.',
  invalidPhoneNumber: 'Must be numeric, 10 digits.',
  invalidEmail: 'Invalid email address.'
};

export const ERROR_MESSAGES: Readonly<ErrorMessages> = Object.freeze(errorMessages);
