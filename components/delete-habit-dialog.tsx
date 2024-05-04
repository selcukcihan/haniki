'use client'

import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { deleteHabit } from "@/app/actions"
import { useFormStatus } from 'react-dom'
import { useState } from "react"

function FormContents(props: any) {
  const [enabled, setEnabled] = useState(false)
  const handleChange = (event: any) => {
    setEnabled(event?.target?.value === props.habitName)
  }
  const { pending } = useFormStatus()
  return (
    <>
      <fieldset disabled={pending}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="habitName">Confirm Habit Name</Label>
            <Input id="habitName" type="text" onChange={handleChange} placeholder="Type name of the habit to confirm." />
          </div>
        </div>
      </fieldset>
      <DialogFooter>
        <Button disabled={pending || !enabled} type="submit">Delete</Button>
      </DialogFooter>
    </>
  )
}

export function DeleteHabitDialog(props: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete habit</DialogTitle>
          <DialogDescription>Type name of the habit to confirm.</DialogDescription>
        </DialogHeader>
        <form action={() => deleteHabit(props.habitId)} >
          <FormContents {...props} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
