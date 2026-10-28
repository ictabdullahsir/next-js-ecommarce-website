import { MongoClient, type Db } from 'mongodb'

const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> }

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set. Add it to .env.local (see .env.example).')
  globalForMongo._mongoClient ??= new MongoClient(uri).connect()
  return (await globalForMongo._mongoClient).db(process.env.MONGODB_DB || 'loom')
}
