'use client'

import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateHabit } from "@/app/actions"
import { useFormStatus } from 'react-dom'

function FormContents(props: any) {
  const { pending } = useFormStatus()
  return (
    <>
      <fieldset disabled={pending}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="habitName">Habit Name</Label>
            <Input id="habitName" minLength={1} type="text" required={true} name="habitName" placeholder="e.g. Exercise daily" defaultValue={props.habitName} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="habitDescription">Habit Description</Label>
            <Textarea id="habitDescription" name="habitDescription" placeholder="Describe your new habit" defaultValue={props.habitDescription} />
          </div>
        </div>
      </fieldset>
      <DialogFooter>
        <Button disabled={pending} type="submit">Update</Button>
      </DialogFooter>
    </>
  )
}

export function EditHabitDialog(props: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update habit</DialogTitle>
          <DialogDescription>Enter the details for your habit.</DialogDescription>
        </DialogHeader>
        <form action={(formData: FormData) => updateHabit(props.habitId, formData.get("habitName") as string, formData.get("habitDescription") as string )} >
          <FormContents {...props} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
