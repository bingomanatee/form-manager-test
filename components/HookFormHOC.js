import { useForm } from "react-hook-form"
import { useCallback, useMemo, useState } from "react"
import uniqueContext from "@/components/uniqueContext"

export default function HookFormHOC(Component, { baseFormId, onSubmit }) {

  const DecoratedForm = ({}) => {
    const { register, handleSubmit } = useForm({ mode: 'onSubmit' });

    const formId = useMemo(() => uniqueContext(baseFormId), [])
    // a 'shadow' error collection set only by the onError below
    const [errorsOnSubmit, setEOS] = useState({})
    // a cancel proxy to allow for cancellation of the blur respons
    const [handleFieldBlurTimeout, setHandleFieldBlurTimeout] = useState(0)

    // ------------------ form submission hooks -------------
    const handleOnSubmit = useCallback((data, e) => {
      e.preventDefault()
      onSubmit(data)
      if (handleFieldBlurTimeout) {
        clearTimeout(handleFieldBlurTimeout)
        setHandleFieldBlurTimeout(null)
      }
      setEOS({})
    }, [setEOS, handleFieldBlurTimeout])

    const onError = useCallback((errors, e) => {
      e.preventDefault()
      if (handleFieldBlurTimeout) {
        clearTimeout(handleFieldBlurTimeout)
        setHandleFieldBlurTimeout(null)
      }
      setEOS(errors)
    }, [setEOS, handleFieldBlurTimeout])
    // ----------------- asserting shadow error clearing on blur
    const handleFieldBlur = useCallback((e) => {
      const name = e.target.name
      const currentEOS = errorsOnSubmit
      /*
      in order not to "shortcut" the form submission the "shadow error"
      has to be cleared slightly after the field is blurred. However,
      we need to be able to abort this action in case the field is blurred
      AND the data is submitted in one fell swoop by clicking submit
      WHILE the field has focus.
       */
      setHandleFieldBlurTimeout(setTimeout(() => {
        if (errorsOnSubmit === currentEOS) {
          setEOS({ ...errorsOnSubmit, [name]: undefined })
        }
      }, 200))

    }, [errorsOnSubmit, setEOS])

    /**
     * this method "injects" the handleFieldBlur hook as a peer of
     * the onBlur hook returned by register.
     * It also injects a unique ID, and sets the aria-describe-by target
     */
    const decorateHooks = useCallback((registerHandlers) => {
      const { onBlur: oldOnBlur, name } = registerHandlers
      return {
        ...registerHandlers,
        onBlur: (...args) => {
          if (oldOnBlur) {
            oldOnBlur(...args)
          }
          handleFieldBlur(...args)
        },
        id: `${formId}__${name}`,
        'aria-describedby': `${formId}__${name}__errors`
      }
    }, [handleFieldBlur])

    const ariaInvalid = (name) => {
      const invalid = errorsOnSubmit[name] ? 'true' : 'false'
      return { ['aria-invalid']: invalid }
    }

    return (
      <Component register={register}
                 ariaInvalid={ariaInvalid}
                 decorateHooks={decorateHooks}
                 formId={formId}
                 errors={errorsOnSubmit}
                 onSubmit={handleSubmit(handleOnSubmit, onError)}/>
    )
  }
  return DecoratedForm;
}
