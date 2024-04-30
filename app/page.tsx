import Image from "next/image";
import { SignIn } from "../components/sign-in-form";
import { auth } from "@/auth"
import { SignOut } from "../components/sign-out-form";
import { LandingPage } from "../components/landing-page";
import { Habits } from "../components/habits";

export default async function Home() {
  const session = await auth()
  console.info("Running Home")
  if (session) {
    return (<Habits session={session}></Habits>)
  } else {
    return (
      <LandingPage></LandingPage>
    );
  
  }
}
