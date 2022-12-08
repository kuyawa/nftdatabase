import { PrismaClient } from "@prisma/client"
// @ts-ignore
import checkApiKey from "/lib/checkApiKey"

// GET /api/collections/user/[id]
// get all collections by user id
export default async function handler(req, res) {
  let { method, headers, query } = req
  console.log('- COLLECTIONS BY USER', query.id)
  switch (method) {
    case "GET":
      try {
        let authorized = await checkApiKey(headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' })
        }
        let prisma = new PrismaClient()
        await prisma.$connect()
        let data = await prisma.collections.findMany({where: {authorId: query.id}})
        await prisma.$disconnect()
        //console.log('DATA:', data)
        console.log('DATA:', data?.length)
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