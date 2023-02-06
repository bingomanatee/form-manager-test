import HookFormHOC from "@/components/HookFormHOC"
import BaseReactHookForm from "@/components/BaseReactHookForm"
import Navigation from "@/components/Navigation"

const HookFormDecorated = HookFormHOC(BaseReactHookForm, {
  formId: 'sample-hook-form',
  onSubmit: (data) => {
    console.log('submitting data: ', data)
  }
})

function ReactHookForm() {
  return (
    <>
      <Navigation/>
      <HookFormDecorated/>
    </>
  )
}

export default ReactHookForm;
