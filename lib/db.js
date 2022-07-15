import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.mongodb_uri);
  return client;
}
