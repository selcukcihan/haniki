import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { DynamoDBAdapter } from "@auth/dynamodb-adapter"

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.AUTH_DYNAMODB_ID || '',
    secretAccessKey: process.env.AUTH_DYNAMODB_SECRET || '',
  },
  region: process.env.AUTH_DYNAMODB_REGION,
}
 
const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
})

const adapter = DynamoDBAdapter(client, {
  tableName: process.env.DYNAMODB_TABLE_NAME || '',
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: adapter,
})
