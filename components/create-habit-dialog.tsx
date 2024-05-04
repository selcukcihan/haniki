'use client'

import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createHabit } from "@/app/actions"
import { useFormStatus } from 'react-dom'

function FormContents() {
  const { pending } = useFormStatus()
  return (
    <>
      <fieldset disabled={pending}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="habitName">Habit Name</Label>
            <Input id="habitName" minLength={1} type="text" required={true} name="habitName" placeholder="e.g. Exercise daily" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="habitDescription">Habit Description</Label>
            <Textarea id="habitDescription" name="habitDescription" placeholder="Describe your new habit" />
          </div>
        </div>
      </fieldset>
      <DialogFooter>
        <Button disabled={pending} type="submit">Create Habit</Button>
      </DialogFooter>
    </>
  )
}

export function CreateHabitDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Habit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>Enter the details for your new habit.</DialogDescription>
        </DialogHeader>
        <form action={(formData: FormData) => createHabit(formData)} >
          <FormContents />
        </form>
      </DialogContent>
    </Dialog>
  )
}
