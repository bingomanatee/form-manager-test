export function errorFieldName(formId, name) {
  return `${formId}__${name}__errors`
}

export function ariaFields(formId, name, hasErrors) {
  const ariaInvalid = hasErrors ? 'true' : 'false';
  return {
    'aria-invalid': ariaInvalid,
    'aria-describedby': errorFieldName(formId, name)
  }
}

export function inputId(formId, name) {
  return `${formId}__${name}`
}
