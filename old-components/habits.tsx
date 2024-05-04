/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/vvW3t6W5Clf
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Arimo } from 'next/font/google'
import { Judson } from 'next/font/google'

arimo({
  subsets: ['latin'],
  display: 'swap',
})

judson({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/

import { Header } from "@/components/header"
import { CreateHabitDialog } from "./create-habit-dialog"
import { Session } from "@auth/core/types"
import { getHabits, Habit } from "@/db"
import { HabitCard } from "./habit-card"
import { NewHabitCard, HabitProps } from "./new-habit-card"

const calculateLast30DaysCount = (logs: string[]) => {
  const last30Days = new Date()
  last30Days.setDate(last30Days.getDate() - 30)
  return logs.filter((log) => new Date(log) > last30Days).length
}

const calculateMonthlyCounts = (logs: string[]) => {
  const monthlyCounts: { name: string, count: number }[] = []
  const today = new Date()
  let month = today.getMonth()
  let year = today.getFullYear()
  for (let i = 0; i < 6; i++) {
    const monthLogs = logs.filter((log) => {
      const logDate = new Date(log)
      return logDate.getMonth() === month && logDate.getFullYear() === year
    })
    monthlyCounts.push({ name: `${month + 1}/${year}`, count: monthLogs.length })
    month--
    if (month < 0) {
      month = 11
      year--
    }
  }
  return monthlyCounts
}

export async function Habits({ session }: { session: Session} ) {
  const habits = await getHabits(session.user?.id || '')
  const habitProps = habits.map((habit: Habit) => ({
    habitName: habit.habitName,
    habitDescription: habit.habitDescription,
    last30DaysCount: calculateLast30DaysCount(habit.logs || []),
    monthlyCounts: calculateMonthlyCounts(habit.logs || [])
  }))
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header/>
      <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 md:p-10">
        <div className="max-w-6xl mx-auto grid gap-8">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-4">
            <h1 className="text-3xl font-bold">Your Habits</h1>
            <CreateHabitDialog opened={habits.length === 0} />
          </div>
          <div className="grid gap-4">
            {habitProps.sort((h1, h2) => h1.habitName < h2.habitName ? -1 : 1).map((prop: any) => (
              <NewHabitCard {...prop} key={prop.habitId}/>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}