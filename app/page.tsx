import { auth } from "@/auth"
import { LandingPage } from "@/components/landing-page"
import { Habits } from "@/components/habits"

export default async function Home() {
  const session = await auth()
  if (session) {
    return (<Habits session={session}></Habits>)
  } else {
    return (
      <LandingPage />
    )
  }
}
