import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Bitte MONGODB_URI in .env.local setzen");
}

if (process.env.NODE_ENV === "development") {
  // @ts-expect-error: global._mongoClientPromise ist nicht typisiert
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    // @ts-expect-error: global._mongoClientPromise ist nicht typisiert
    global._mongoClientPromise = client.connect();
  }
  // @ts-expect-error: global._mongoClientPromise ist nicht typisiert
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise; 