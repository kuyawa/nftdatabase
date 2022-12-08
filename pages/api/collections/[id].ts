import { PrismaClient } from "@prisma/client"
// @ts-ignore
import checkApiKey from "/lib/checkApiKey"

// GET /api/collections/[id]
// get collection by id
export default async function handler(req, res) {
  let { method, headers, query } = req
  console.log('- COLLECTION BY ID', query.id)
  switch (method) {
    case "GET":
      try {
        let authorized = await checkApiKey(headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' })
        }
        let prisma = new PrismaClient()
        await prisma.$connect()
        let data = await prisma.collections.findUnique({
          where: {id: query.id},
          include:{
            author: true,
            artworks: true
          }
        })
        await prisma.$disconnect()
        //console.log('DATA:', data)
        res.status(200).json({ success: true, data: data })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false, error:error.message })
      }
      break
    default:
      res.status(400).json({ success: false, error:'HTTP method not accepted' })
      break
  }
}