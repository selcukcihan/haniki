import Link from "next/link"
import { SignOutForm } from "./sign-out-form"
import { MountainIcon } from "./icons"

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="#">
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Habit Tracker</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <SignOutForm/>
      </nav>
    </header>
  )
}