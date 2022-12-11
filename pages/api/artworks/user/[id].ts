import { PrismaClient, Prisma } from "@prisma/client"
// @ts-ignore
import checkApiKey from "/lib/checkApiKey"

// GET /api/artworks/user/[id]
// get all nfts by user id
export default async function handler(req, res) {
  let { method, headers, query } = req
  console.log('- ARTWORKS BY USER', query.id)
  switch (method) {
    case "GET":
      try {
        let authorized = await checkApiKey(headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' })
        }
        let prisma = new PrismaClient()
        await prisma.$connect()
        let data = await prisma.artworks.findMany({
          where: {authorId: query.id},
          include: { author: true, collection: true, beneficiary: true }
          /*include: { author: true }*/
        })
        await prisma.$disconnect()
        //console.log('DATA:', data)
        //console.log('DATA:', data?.length)
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