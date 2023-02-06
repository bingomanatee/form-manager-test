import { useForm } from "react-hook-form"
import { useCallback, useState } from "react"
import { ariaFields, errorFieldName, inputId } from "@/lib/utils"

/**
 * This handles some of the maneuvers necessary to use our current tempo with
 * the RHF input
 *
 * The primary shift is that instead of using the dynamic errors exposed by
 * formState, we use an error
 *
 * @param Component
 * @param formId
 * @param onSubmit
 * @returns {function({})}
 * @constructor
 */
export default function HookFormHOC(Component, { formId, onSubmit }) {
  const DecoratedForm = ({}) => {
    const { register, handleSubmit } = useForm({ mode: 'onSubmit' })

    // a 'shadow' error collection set only by the onError below
    const [errors, setErrors] = useState({})
    // a "pointer" to the field blur
    // to allow for cancellation of the blur response
    const [handleFieldBlurTimeout, setHandleFieldBlurTimeout] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    // ------------------ form submission hooks -------------
    const handleOnSubmit = useCallback((data, e) => {
      e.preventDefault()
      onSubmit(data)
      setSubmitted(true)
      if (handleFieldBlurTimeout) {
        clearTimeout(handleFieldBlurTimeout)
        setHandleFieldBlurTimeout(null)
      }
      setErrors({})
    }, [setErrors, handleFieldBlurTimeout])

    const onError = useCallback((formErrors, e) => {
      e.preventDefault()
      if (handleFieldBlurTimeout) {
        clearTimeout(handleFieldBlurTimeout)
        setHandleFieldBlurTimeout(null)
      }
      setErrors(formErrors)
    }, [setErrors, handleFieldBlurTimeout])

    // ----------------- asserting shadow error clearing on blur
    const handleFieldBlur = useCallback((e) => {
      const name = e.target.name
      const currentEOS = errors
      /*
      in order not to "shortcut" the form submission the "shadow error"
      has to be cleared slightly after the field is blurred. However,
      we need to be able to abort this action in case the field is blurred
      AND the data is submitted in one fell swoop by clicking submit
      WHILE the field has focus.
       */
      setHandleFieldBlurTimeout(setTimeout(() => {
        if (errors === currentEOS) {
          setErrors({ ...errors, [name]: undefined })
        }
      }, 200))

    }, [errors, setErrors])

    const getAriaFields = (name) => {
      const invalid = errors[name] ? 'true' : 'false'
      return ariaFields(formId, name, invalid)
    }

    /**
     * this method "injects" the handleFieldBlur hook as a peer of
     * the onBlur hook returned by register.
     * It also injects a unique ID,
     */
    const decorateHooks = useCallback((registerHandlers) => {
      const { onBlur: oldOnBlur, name } = registerHandlers
      const arias = ariaFields(formId, name, false)
      delete arias['aria-invalid']
      return {
        ...registerHandlers,
        onBlur: (...args) => {
          if (oldOnBlur) {
            oldOnBlur(...args)
          }
          handleFieldBlur(...args)
        },
        id: inputId(formId, name)
      }
    }, [handleFieldBlur, formId])

    return (
      <>
        <Component register={register}
                   getAriaFields={getAriaFields}
                   decorateHooks={decorateHooks}
                   formId={formId}
                   errors={errors}
                   onSubmit={handleSubmit(handleOnSubmit, onError)}/>
        {submitted && <p>Form Data submitted</p>}
      </>

    )
  }
  return DecoratedForm
}
