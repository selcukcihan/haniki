'use client'

import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveBar } from "@nivo/bar"
import { useFormStatus } from 'react-dom'
import { switchToday } from "../app/actions"
import { EditHabitDialog } from "./edit-habit-dialog"
import { DeleteHabitDialog } from "./delete-habit-dialog"

const LogButton = (props: any) => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending}>{props.isTodayLogged ? "Unlog Today" : "Log Today"}</Button>
  )
}

export function HabitCard(props: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.habitName}</CardTitle>
        <CardDescription>{props.habitDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart {...props} className="aspect-[4/3] md:aspect-[8/3]" />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EditHabitDialog {...props} />
          <DeleteHabitDialog {...props} />
        </div>
        <form className="justify-end" action={() => switchToday(props.habitId)} >
          <LogButton {...props} />
        </form>
      </CardFooter>
    </Card>
  )
}

function BarChart(props: any) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={props.monthlyCounts}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#12372A"]} // color of the bar
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        maxValue={31}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
          legend: "count",
          legendPosition: "middle",
          legendOffset: 0,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            container: {
              fontSize: "12px",
              color: "#119900", // color of the tooltip
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          text: {
            fill: "#AAAAAC",
            fontSize: 14,
          },
          grid: {
            line: {
              stroke: "#AAAAAC", // color of the lines
            },
          },
        }}
      />
    </div>
  )
}
