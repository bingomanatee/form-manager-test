import styles from '../styles/form.module.scss'
import { FormErrorMessage } from "@/components/ReactHookFormError"
import { useCallback, useEffect, useMemo, useReducer } from "react"
import formReducer, {
  errorMessage,
  inputValues,
  generateInputHooks,
  initialFromConfig,
  handleSubmit
} from "@/lib/form-reducer"
import { config } from "@/lib/config"
const formId ='sample-reducer-form';

export default function ReducerForm({onSubmit}) {
  const [formState, dispatch] = useReducer(formReducer(config), { config, formId }, initialFromConfig)
  /*
  hooks are a map of the handlers embedded into inputs keyed by name
   */
  const hooks = useMemo(() => {
    return new Map(
      config.map((config) => generateInputHooks(config, dispatch, formId))
    )
  }, [dispatch, config])

  const doSubmit = useCallback((e) => {
    handleSubmit(dispatch)(e);
  }, [dispatch]);

  useEffect(() => {
    if (formState.submitted) {
      onSubmit(formState);
    }
  }, [formState.submitted]);

  return (
    <div className={styles.container}>
      <h1>Using Reducer for field control</h1>
      <form id={formId} onSubmit={doSubmit}>
        <section className={styles.fieldSection}>
          <div className={styles.field}>
            <label>Name</label>
            <input type="text"
                   {...hooks.get('name') || {}}
                   {...inputValues(formState, 'name')}
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
                   {...inputValues(formState, 'phone')}
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
                   {...inputValues(formState, 'password')}
            />
          </div>
          <FormErrorMessage name="password"
                            message={errorMessage(formState, 'password')}
                            formId={formState.formId}/>
        </section>

        <section>
          <button className={styles.submitButton} onClick={doSubmit} type="submit">Submit</button>
        </section>
      </form>

      <h2>Current Reducer Value</h2>
      <code>
        <pre>
        {JSON.stringify(formState, true,2)}
        </pre>
      </code>
    </div>
  )

}
