import styles from './form-error.module.scss'
import { ErrorMessage } from '@hookform/error-message'
import { memo } from "react"

function BaseFormErrorMessage({ message, name, formId }) {
  return message ? <div id={`${formId}__${name}__errors`} role="alert" className={styles.error}>{message}</div> : null;
}

export const FormErrorMessage = memo(BaseFormErrorMessage);

export default function ReactHookFormError({ name, errors, formId, messageKeys = {} }) {
  const fieldError = errors && errors[name]
  if (!fieldError) {
    return null
  }

  if (messageKeys && fieldError.type && fieldError.type in messageKeys) {
    return <FormErrorMessage name={name} formId={formId} message={messageKeys[fieldError.type]}/>
  }

  if (fieldError.type === 'required') {
    return <FormErrorMessage name={name} formId={formId} message="Required"/>
  }

  if (fieldError.type === 'pattern') {
    return <FormErrorMessage name={name} formId={formId} message="invalid input"/>
  }

  return <ErrorMessage name={name} formId={formId} errors={errors}
                       render={({ message }) => <FormErrorMessage name={name} formId={formId} message={message}/>}/>
}
