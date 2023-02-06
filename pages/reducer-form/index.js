import ReducerForm from "@/components/ReducerForm"
import Navigation from "@/components/Navigation"
import { useState } from "react"

const ReducerFormPage = () => {
  const [sent, setSent] = useState(false)
  return (
    <>
      <Navigation/>
      <ReducerForm onSubmit={setSent}/>
      {sent && <p>form submitted</p>}
    </>
  )
}

export default ReducerFormPage

