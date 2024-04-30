import Image from "next/image";
import { SignIn } from "../components/sign-in-form";
import { auth } from "@/auth"
import { SignOut } from "../components/sign-out-form";

export default async function Home() {
  const session = await auth()
  console.info("Running Home")
  if (session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Haniki Logo"
            width={100}
            height={100}
          />
          <h1 className="text-4xl font-bold text-gray-800 mt-4">Welcome to Haniki</h1>
        </div>
        <p className="text-lg text-gray-600">You are signed in as {session?.user?.email}</p>
        <SignOut></SignOut>
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SignIn></SignIn>
      </main>
    );
  
  }
}
