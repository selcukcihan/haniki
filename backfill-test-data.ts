import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createHabit, deleteHabit, getHabits } from "./db";
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


export const createRandomHabit = async (day: string, userId: string, habitId: string) => {
  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Item: {
      pk: `USER#${userId}`,
      sk: `LOG#${habitId}#${day}`,
      logDate: day,
    },
  })

  const response = await docClient.send(command)
  return response
}

async function main() {
  console.log("Backfilling random data...")
  const userId = "4670b18e-48ac-4e85-bcbd-6d4ca79abf27"
  const habits = await getHabits(userId)
  for (const habit of habits) {
    await deleteHabit(habit.habitId, userId)
  }

  await createHabit(userId, "Drink water", "Drink 8 glasses of water a day")
  const habit = (await getHabits(userId))[0]
  for(let i = 0; i < 30; i++) {
    if (Math.floor(Math.random() * 10) < 7) {
      const day = new Date()
      day.setDate(day.getDate() - i)
      await createRandomHabit(day.toISOString().split('T')[0], userId, habit.habitId)
    }
  }
}

main().then(() => {
  console.log("Backfilling completed!")
})
