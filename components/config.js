export const config = [
  {
    name: 'name',
    validator(value) {
      if (!value) {
        return 'Required'
      }
      return false
    }
  },
  {
    name: 'phone',
    validator(value) {
      if (!value) return 'Required';
      if (!/[\d]{3}-[\d]{3}-[\d]{4}/.test(value)) {
        return 'must be a phone number "ddd-ddd-dddd" input'
      }
      return false
    }
  },
  {
    name: 'password',
    validator(string) {
      if (!string) {
        return 'Required'
      }
      if (!/[\d]/.test(string)) {
        return 'Must have at least one number'
      }
      if (!/[a-z]/.test(string)) {
        return 'Must have a lowercase letter'
      }
      if (!/[A-Z]/.test(string)) {
        return 'Must have an uppercase letter'
      }
      return false
    }
  }
]
