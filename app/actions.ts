'use server'

import { createHabit as create, updateHabit as update, deleteHabit as deleteHabitRecord, logHabit as log } from "@/db"
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export async function createHabit(formData: FormData) {
  const session = await auth()
  if (session) {
    await create(session.user?.id || '', formData.get("habitName") as string, formData.get("habitDescription") as string)
  }
  redirect('/')
}

export async function deleteHabit(habitId: string) {
  const session = await auth()
  if (session) {
    await deleteHabitRecord(session.user?.id || '', habitId)
  }
  redirect('/')
}

export async function updateHabit(habitId: string, habitName: string) {
  const session = await auth()
  if (session) {
    await update(session.user?.id || '', habitId, habitName);
  }
  redirect('/')
}

export async function logHabit(habitId: string) {
  const session = await auth()
  if (session) {
    await log(session.user?.id || '', habitId)
  }
  redirect('/')
}
