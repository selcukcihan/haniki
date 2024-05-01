import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, QueryCommand, DeleteCommand, UpdateCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export interface Habit {
  habitId: string;
  habitName: string;
  habitDescription?: string;
  logs?: string[];
}

export const logHabit = async (userId: string, habitId: string) => {
  const today = new Date().toISOString().split('T')[0]
  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Item: {
      pk: `USER#${userId}`,
      sk: `LOG#${habitId}#${today}`,
      logDate: today,
    },
  })

  const response = await docClient.send(command)
  return response
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
  const command = new BatchWriteCommand({
    RequestItems: {
      [process.env.DYNAMODB_TABLE_NAME || '']: requests,
    },
  })

  await docClient.send(command)
}

export const updateHabit = async (userId: string, habitId: string, habitName: string) => {
  const command = new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `USER#${userId}`,
      sk: `HABIT#${habitId}`,
    },
    UpdateExpression: "SET habitName = :habitName",
    ExpressionAttributeValues: {
      ":habitName": habitName,
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
