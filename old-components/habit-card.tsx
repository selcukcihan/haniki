'use client'

import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Button } from "@/old-components/ui/button"
import { Habit } from "@/db"
import { DeleteHabitDialog } from "./delete-habit-dialog"
import { EditHabitDialog } from "./edit-habit-dialog"
import { switchToday } from "../app/actions"
import { useFormStatus } from 'react-dom'

const LogButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button size="icon" variant="outline" disabled={pending}>
      <CheckIcon className="h-5 w-5" />
      <span className="sr-only">Track habit</span>
    </Button>
  )
}

export function HabitCard({ habit }: { habit: Habit }) {
  return (
    <Card>
      <CardHeader className="flex flex-col items-start justify-between">
        <div>
          <CardTitle>{habit.habitName}</CardTitle>
          <CardDescription>{habit.habitDescription}</CardDescription>
        </div>
        <div className="flex gap-2">
          <EditHabitDialog habit={habit}/>
          <DeleteHabitDialog habit={habit}/>
        </div>
      </CardHeader>
      <CardContent>
        <form action={() => switchToday(habit.habitId)} >
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{habit.logs?.length || 0}</div>
            <LogButton/>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function CheckIcon(props) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
