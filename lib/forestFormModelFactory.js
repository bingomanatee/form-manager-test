import { Forest } from '@wonderlandlabs/forest'
import { ariaFields, inputId } from "@/lib/utils"

/**
 * express child configuration for fields as a [key, config] pair,
 * for import into a Map constructor
 * @param name {string}
 * @param validator {function(string): error | falsy}
 * @param formId {string}
 * @returns {[string, leafConfig]}
 * */
function fieldConfig({ name, validator }, formId) {

  return [
    name,
    {
      $value: { name, value: '', error: '' },
      actions: {
        validate(leaf) {
          leaf.do.set_error(validator(leaf.value.value))
        },
        update(leaf, e) {
          leaf.do.set_value(e.target.value)
        },
        clearError(leaf) {
          leaf.do.set_error(false)
        },
        id(leaf) {
          return inputId(formId, leaf.value.name)
        },
        inputProps(leaf) {
          return {
            name,
            id: leaf.do.id(),
            onChange: leaf.do.update,
            onBlur: leaf.do.clearError,
            ...ariaFields(formId, name, leaf.value.errors)
          }
        }
      }
    }
  ]
}

function fieldFactory(config, formId, onSubmit) {
  return new Forest({
    $value: {
      submitted: false
    },
    children: {
      fields: {
        $value: new Map(),
        children: new Map(config.map((config) => fieldConfig(config, formId))),
        actions: {
          asObject(leaf) {
            return leaf.store.getReduce((memo, value) => {
              memo[value.name] = value.value
              return memo
            }, {})
          }
        }
      }
    },
    actions: {
      submit(leaf) {
        console.log('submitting')
        // delaying somewhat because of race condition with onBlur
        setTimeout(() => {
          let hasErrors = false
          leaf.child('fields').children.forEach(({ child }) => {
            child.do.validate()
            hasErrors = hasErrors || child.value.error
          })
          if (!hasErrors) {
            leaf.do.set_submitted(true)
            onSubmit(leaf.child('fields').do.asObject())
          } else {
            console.log('has errors', hasErrors)
          }
        }, 200)

      }
    }
  })

}


export default fieldFactory
