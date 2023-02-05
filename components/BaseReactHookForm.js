import styles from '../styles/form.module.scss'
import ReactHookFormError from "@/components/ReactHookFormError"

export default function BaseReactHookForm({ onSubmit, register, decorateHooks, ariaInvalid, formId, errors }) {
  return (
    <div className={styles.container}>
      <h1>Using React Hook Form for field control</h1>
      <form id={formId} onSubmit={onSubmit}>
        <section className={styles.fieldSection}>
          <div className={styles.field}>
            <label>Name</label>
            <input type="text"
                   {...decorateHooks(register('name', { required: true }))}
                   {...ariaInvalid('name')}
            />
          </div>
          <ReactHookFormError formId={formId} name="name" errors={errors}/>
        </section>

        <section className={styles.fieldSection}>
          <div className={styles.field}>
            <label>Phone Number</label>
            <input type="text"
                   {...decorateHooks(register('phone', {
                     required: true,
                     pattern: /[\d]{3}-[\d]{3}-[\d]{4}/
                   }))}
                   {...ariaInvalid('phone')}
            />
          </div>
          <ReactHookFormError formId={formId}
                              name="phone"
                              errors={errors}
                              messageKeys={{ pattern: 'must be a phone number "ddd-ddd-dddd" input' }}/>
        </section>

        <section className={styles.fieldSection}>
          <div className={styles.field}>
            <label>New Password</label>
            <input type="text"
                   {...decorateHooks(register('password', {
                     validate: {
                       required: (string) => !!string,
                       hasNumber: (string) => /[\d]/.test(string),
                       hasLowercase: (string) => /[a-z]/.test(string),
                       hasUppercase: (string) => /[A-Z]/.test(string)
                     }
                   }))}
                   {...ariaInvalid('password')}
            />
          </div>
          <ReactHookFormError formId={formId}
                              name="password"
                              errors={errors}
                              messageKeys={{
                                hasNumber: 'Must have at least one number',
                                hasLowercase: 'Must have a lowercase letter',
                                hasUppercase: 'Must have an uppercase letter'
                              }}/>
        </section>

        <section>
          <button className={styles.submitButton} type="submit">Submit</button>
        </section>
      </form>
    </div>
  )

}
