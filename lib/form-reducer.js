// transforms the field configuration into a reducer
export function initialFromConfig({ config, formId }) {
  return {
    formId,
    fields: config.map((config) => {
      return { name: config.name, value: config.value || '', error: false, valueError: false, touched: true }
    }),
    submitted: false
  }
}

// creates a transform for withField that updates the field's value
function updateFieldFactory({ fieldValue }) {
  return (fieldState, config) => {
    fieldState.value = fieldValue
    fieldState.touched = true
    if (config.validator) {
      fieldState.valueError = config.validator(fieldValue)
    }
    return fieldState
  }
}

// retrieve a field's error.
export function errorMessage(formState, name) {
  const field = findName(formState.fields, name, 'errorMessages')
  if (!field) {
    return false
  }
  return field.error
}

// retrieve an element from an array by name
function findName(items, fieldName, source) {
  if (Array.isArray(items)) {
    return items.find((config) => config.name === fieldName)
  } else {
    console.warn('--- findName: cannot analyze', items, source)
  }
}

// a utility function for performing an operation on a single field
function withField(fieldsConfig, formState, field, transform) {
  const index = formState.fields.findIndex((fieldEle) => fieldEle.name === field)
  if (index < 0) {
    return formState
  }
  const fieldDef = formState.fields[index]
  const fieldConfig = findName(fieldsConfig, field, 'withField')
  const newFields = [...formState.fields];
  newFields[index] = transform({ ...fieldDef }, fieldConfig)

  return { ...formState, fields: newFields }
}

function displayErrors(formState, fieldsConfig) {
  return {
    ...formState, fields: formState.fields.map((fieldDef) => {
      const config = findName(fieldsConfig, fieldDef.name, 'displayErrors')
      if (!(config && config.validator)) {
        return fieldDef
      }
      const error = config.validator(fieldDef.value)
      return ({
        ...fieldDef,
        error: error,
        valueError: error
      })
    })
  }
}

// a transform function for withField to cloak the error.
function hideError(formState) {
  return {
    ...formState,
    error: false
  }
}

// mark the form as submitted
export function submitFactory(dispatcher) {
  return (e) => {
    e.preventDefault()
    dispatcher({
      name: 'submit',
      data: false
    })
  }
}

// return transient values from the store for use in the input
export function fieldValues(formState, name) {
  const field = findName(formState.fields, name, 'fieldValues');
  if (!field) {
    return {
      value: '',
    }
  }

  const ariaInvalid = field.errors ? 'true' : 'false'

  return {
    value: field.value,
    'aria-invalid': ariaInvalid,
    'aria-described-by': `${formState.formId}__${name}__errors`
  }
}

// generate triggers to embed into inputs -- as Map key/value
export function generateHooks(config, dispatch, formId) {
  return [
    config.name,
    {
      name: config.name,
      id: `${formId}__${config.name}`,
      onChange(e) {
        dispatch({
          name: 'update field value',
          data: {
            fieldName: config.name,
            fieldValue: e.target.value
          }
        })
      },
      onBlur() {
        dispatch({
          name: 'hide error',
          data: { fieldName: config.name }
        })
      }
    }
  ]
}

// produce a reducer based on the config file
const reducerFactory = (fieldsConfig) => {
  return (formState, action) => {

    const { name, data } = action

    let out = formState
    switch (name) {
      case 'update field value':
        out = withField(fieldsConfig, formState, data.fieldName, updateFieldFactory(data))
        break

      case 'display errors':
        out = displayErrors(formState, fieldsConfig)
        break

      case 'submit':
        out = displayErrors(formState, fieldsConfig)
        if (!out.fields.find((n) => n.valueError)) {
          out.submitted = true
        }
        break

      case 'hide error':
        out = withField(fieldsConfig, formState, data.fieldName, hideError)
        break
    }

    return out
  }

}

export default reducerFactory
