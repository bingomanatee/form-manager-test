import Link from "next/link"

function Navigation ()  {
  return (
    <nav>
      <Link href="/">Home</Link>

      <Link href="/reducer-form">Reducer Form</Link>

      <Link href="/react-hook-form">React Hook Form</Link>

      <Link href="/forest-form">Forest Form</Link>
    </nav>
  )
}


export default Navigation;
