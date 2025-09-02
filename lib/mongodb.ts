import { MongoClient } from "mongodb"

const client: MongoClient | null = null
let promise: Promise<MongoClient> | null = null

export function getMongoClient() {
  const uri = process.env.MONGODB_URI as string;
  if (!uri) {
    throw new Error("Missing MONGODB_URI env var")
  }
  if (client) return client
  if (!promise) {
    promise = MongoClient.connect(uri, {})
  }
  // @ts-ignore
  globalThis._mongoClientPromise = promise
  return client as unknown as MongoClient
}

export async function getDb() {
  const uri = process.env.MONGODB_URI as string;
  const dbName = process.env.MONGODB_DB as string;
  if (!uri || !dbName) {
    throw new Error("Missing MONGODB_URI or MONGODB_DB env vars")
  }

  // maintain a single connection
  // @ts-ignore
  if (!globalThis.__mongo) {
    // @ts-ignore
    globalThis.__mongo = new MongoClient(uri)
  }
  // @ts-ignore
  const cli: MongoClient = globalThis.__mongo
  // if (!cli.topology?.isConnected()) {
  //   await cli.connect()
  // }
  return cli.db(dbName)
}
