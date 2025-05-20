
export type Rule = {
  name: object,
  password: object,
  email: object,
  mobile: object,
  regNo: object
  text: object
}


export const FormValidation: Rule = {
  name: {
    required: 'Enter full Name',
    minLength: {
      value: 3,
      message: 'Enter a valid Name'
    },
    validate: {
      minTrimmedLength: (value: string) => {
        return value.trim().length >= 3 || 'Name must be at least 3 characters'
      }
    }
  },

  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters'
    },
    validate: {
      minTrimmedLength: (value: string) => {
        return value.trim().length >= 3 || 'password must be at least 6 characters'
      }
    }
  },

  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Enter a valid email'
    },
    validate: {
      minTrimmedLength: (value: string) => {
        return value.trim().length >= 3 || 'email must be at least 3 characters'
      }
    }
  },
  mobile: {
    required: 'Mobile number is required',
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: 'Enter a valid 10-digit mobile number'
    },
    validate: {
      noSpaces: (value: string) => {
        return !/\s/.test(value) || 'Mobile number should not contain spaces';
      }
    }
  },

  regNo: {
    required: 'Registration number is required',
    pattern: {
      value: /^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/i,
      message: 'Enter a valid registration number'
    }
  },

  text: {
    required: 'This field is required',
    minLength: {
      value: 2,
      message: 'Must be at least 2 characters',
    },
    validate: {
      minTrimmedLength: (value: string) =>
        value.trim().length >= 2 || 'Must be at least 2 characters',
      noSymbols: (value: string) =>
        /^[a-zA-Z0-9\s,.'-]*$/.test(value) || 'No special characters allowed',
    },
  },


}
