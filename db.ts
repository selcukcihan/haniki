import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, QueryCommand, DeleteCommand, UpdateCommand, BatchWriteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export interface Habit {
  habitId: string;
  habitName: string;
  habitDescription?: string;
  logs?: string[];
}

export const switchToday = async (userId: string, habitId: string) => {
  const today = new Date().toISOString().split('T')[0]
  const existing = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `USER#${userId}`,
      sk: `LOG#${habitId}#${today}`,
    },
  }))
  console.log(existing)
  if (existing.Item) {
    await docClient.send(new DeleteCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Key: {
        pk: `USER#${userId}`,
        sk: `LOG#${habitId}#${today}`,
      },
    }))
  } else {
    await docClient.send(new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Item: {
        pk: `USER#${userId}`,
        sk: `LOG#${habitId}#${today}`,
        logDate: today,
      },
    }))
  }
}

export const getLogsFull = async (userId: string, habitId: string) => {
  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": `USER#${userId}`,
      ":sk": `LOG#${habitId}#`,
    },
    ConsistentRead: true,
  })

  const response = await docClient.send(command)
  return (response.Items || [])
}

export const getLogs = async (userId: string, habitId: string) => {
  const logs = await getLogsFull(userId, habitId)
  return logs.map((item) => (item.logDate as string))
}

export const createHabit = async (userId: string, habitName: string, habitDescription?: string) => {
  const habitId = uuidv4()
  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Item: {
      pk: `USER#${userId}`,
      sk: `HABIT#${habitId}`,
      habitName,
      habitDescription,
      habitId,
    },
  })

  const response = await docClient.send(command)
  return response
}

export const deleteHabit = async (userId: string, habitId: string) => {
  const logs = await getLogsFull(userId, habitId)
  const requests = logs.map((item) => ({
    DeleteRequest: {
      Key: {
        pk: item.pk,
        sk: item.sk,
      },
    },
  }))
  requests.push({
    DeleteRequest: {
      Key: {
        pk: `USER#${userId}`,
        sk: `HABIT#${habitId}`,
      },
    },
  })
  for (let batch = requests.splice(0, 25); batch.length > 0; batch = requests.splice(0, 25)) {
    const command = new BatchWriteCommand({
      RequestItems: {
        [process.env.DYNAMODB_TABLE_NAME || '']: batch,
      },
    })

    await docClient.send(command)
  }
}

export const updateHabit = async (userId: string, habitId: string, habitName: string, habitDescription?: string) => {
  const command = new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `USER#${userId}`,
      sk: `HABIT#${habitId}`,
    },
    UpdateExpression: "SET habitName = :habitName" + (habitDescription ? ", habitDescription = :habitDescription" : ""),
    ExpressionAttributeValues: {
      ":habitName": habitName,
      ...(habitDescription ? { ":habitDescription": habitDescription } : {}),
    },
  })

  const response = await docClient.send(command)
  return response
}

export const getHabits = async (userId: string) => {
  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": `USER#${userId}`,
      ":sk": "HABIT#",
    },
    ConsistentRead: true,
  })

  const response = await docClient.send(command)
  const habits = (response.Items || []).map((item) => ({
    habitId: item.habitId,
    habitName: item.habitName,
    habitDescription: item.habitDescription,
  } as Habit))
  await Promise.all(habits.map(async (habit) => {
    habit.logs = await getLogs(userId, habit.habitId)
  }))
  return habits
}
