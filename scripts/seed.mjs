// Optional: `npm run seed` resets the catalog and content to the defaults in lib/seed-data.ts.
// (The site seeds itself automatically the first time it runs, so you usually don't need this.)
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in .env.local')
const client = await new MongoClient(process.env.MONGODB_URI).connect()
await client.db(process.env.MONGODB_DB || 'loom').collection('store').deleteOne({ _id: 'main' })
console.log('Store document removed. It will be re-created from seed-data on the next page load.')
await client.close()
