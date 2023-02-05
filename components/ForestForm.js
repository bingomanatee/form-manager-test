import styles from '../styles/form.module.scss'
import { FormErrorMessage } from "@/components/ReactHookFormError"
import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { config } from "@/components/config"
import forestFormModelFactory from "@/components/forestFormModelFactory"
import uniqueContext from "@/components/uniqueContext"
import debounce from 'lodash.debounce';

export default function ForestForm() {
  const formId = useMemo(() => uniqueContext('sample-reducer-form'), [])

  const [formValue, setFormValue] = useState(false)
  const formState = useMemo(() =>
    forestFormModelFactory(config, formId, (value) => {
      console.log('submitted', value);
    }), [config]);

  useEffect(() => {
    const sub = formState.subscribe(setFormValue);
    return () => sub.unsubscribe();
  }, [setFormValue, formState])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSubmit = useCallback(debounce(formState.do.submit, 500), [formState]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    delayedSubmit();
  }, [delayedSubmit]);

  if (!formValue) {
    return ''
  }

  return (
    <div className={styles.container}>
      <h1>Using Reducer for field control</h1>
      <form id={formId} onSubmit={handleSubmit}>
        <section className={styles.fieldSection}>
          <div className={styles.field}>
            <label>Name</label>
            <input type="text"
                   {...formState.root.child('fields').child('name').do.inputProps()}
            />
          </div>
          <FormErrorMessage name="name"
                            message={formValue.fields.get('name').error}
                            formId={formId}/>
        </section>

        <section className={styles.fieldSection}>
          <div className={styles.field}>
            <label>Phone Number</label>
            <input type="text"
                   {...formState.root.child('fields').child('phone').do.inputProps()}
            />
          </div>
          <FormErrorMessage name="name"
                            message={formValue.fields.get('phone').error}
                            formId={formId}/>
        </section>

        <section className={styles.fieldSection}>
          <div className={styles.field}>
            <label>New Password</label>
            <input type="text"
                   {...formState.root.child('fields').child('password').do.inputProps()}

            />
          </div>
          <FormErrorMessage name="password"
                            message={formValue.fields.get('password').error}
                            formId={formId}/>
        </section>

        <section>
          <button className={styles.submitButton} type="submit" onClick={handleSubmit} >Submit</button>
        </section>
      </form>

      {formValue.submitted && <p>Form has been submitted</p>}

      <code>
        <pre>
        {JSON.stringify(formValue, (key, value) => {
          if (value instanceof Map) {
            return Array.from(value.values());
          }
          return value;
        }, 2)}
        </pre>
      </code>
    </div>
  )

}
