import styles from '../styles/form.module.scss'
import { FormErrorMessage } from "@/components/ReactHookFormError"
import { useCallback, useMemo, useReducer } from "react"
import formReducer, {
  errorMessage,
  fieldValues,
  generateHooks,
  initialFromConfig,
  submitFactory
} from "@/lib/form-reducer"
import uniqueContext from "@/components/uniqueContext"

const config = [
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

export default function ReducerForm() {
  const formId = useMemo(() => uniqueContext('sample-reducer-form'), [])
  const [formState, dispatch] = useReducer(formReducer(config), { config, formId }, initialFromConfig)

  const hooks = useMemo(() => {
    return new Map(
      config.map((config) => generateHooks(config, dispatch, formState.formId))
    )
  }, [dispatch, formState.formId])

  const onSubmit = useCallback((e) => submitFactory(dispatch)(e), [dispatch])

  return (
    <div className={styles.container}>
      <h1>Using Reducer for field control</h1>
      <form id={formId} onSubmit={onSubmit}>
        <section className={styles.fieldSection}>
          <div className={styles.field}>
            <label>Name</label>
            <input type="text"
                   {...hooks.get('name') || {}}
                   {...fieldValues(formState, 'name')}
            />
          </div>
          <FormErrorMessage name="name"
                            message={errorMessage(formState, 'name')}
                            formId={formState.formId}/>
        </section>

        <section className={styles.fieldSection}>
          <div className={styles.field}>
            <label>Phone Number</label>
            <input type="text"
                   {...hooks.get('phone') || {}}
                   {...fieldValues(formState, 'phone')}
            />
          </div>
          <FormErrorMessage name="phone"
                            message={errorMessage(formState, 'phone')}
                            formId={formState.formId}/>
        </section>

        <section className={styles.fieldSection}>
          <div className={styles.field}>
            <label>New Password</label>
            <input type="text"
                   {...hooks.get('password') || {}}
                   {...fieldValues(formState, 'password')}
            />
          </div>
          <FormErrorMessage name="password"
                            message={errorMessage(formState, 'password')}
                            formId={formState.formId}/>
        </section>

        <section>
          <button className={styles.submitButton} type="submit">Submit</button>
        </section>
      </form>

      <code>
        <pre>
        {JSON.stringify(formState, true,2)}
        </pre>
      </code>
    </div>
  )

}
