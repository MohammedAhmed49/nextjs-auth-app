import { MongoClient } from "mongodb";

export async function connectToDB() {
  const client = await MongoClient.connect(
    "mongodb+srv://momo:123@cluster0.z7mqdcq.mongodb.net/?retryWrites=true&w=majority"
  );

  return client;
}
