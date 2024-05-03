'use client'

import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogContent, Dialog, DialogClose } from "@/components/ui/dialog"
import Link from "next/link"
import { deleteHabit } from "@/app/actions"
import { MountainIcon } from "./icons"
import { Habit } from "../db"

export function DeleteHabitDialog({ habit }: { habit: Habit }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <TrashIcon className="h-5 w-5" />
          <span className="sr-only">Delete habit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md mx-auto p-4 md:p-10">
        <div className="flex flex-col ">
          <header className="px-4 lg:px-6 h-14 flex items-center">
            <Link className="flex items-center justify-center" href="#">
              <MountainIcon className="h-6 w-6" />
              <span className="sr-only">Habit Tracker</span>
            </Link>
          </header>
          <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 md:p-10 flex items-center justify-center">
            <form action={(formData: FormData) => deleteHabit(habit.habitId)} >
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Deleting habit "{habit.habitName}"</h1>
                <div className="flex">
                  <DialogClose type="submit">Delete</DialogClose>
                </div>
              </div>
            </form>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}
