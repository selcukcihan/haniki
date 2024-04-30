import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export interface Habit {
  habitId: string;
  habitName: string;
}

export const createHabit = async (userId: string, habitName: string) => {
  const habitId = uuidv4();
  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Item: {
      pk: `USER#${userId}`,
      sk: `HABIT#${habitId}`,
      habitName,
      habitId,
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
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
  });

  const response = await docClient.send(command);
  console.log(response);
  return response.Items as Habit[];
}
