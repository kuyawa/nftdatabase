import { PrismaClient } from "@prisma/client"
import { unstable_getServerSession } from "next-auth"
// @ts-ignore
import checkApiKey from "/lib/checkApiKey"
import { authOptions } from "../auth/[...nextauth]"


export default async function handler(req, res) {
  const { method, query } = req
  const prisma = new PrismaClient()
  await prisma.$connect()
  // @ts-ignore
  // const session = await unstable_getServerSession(req, res, authOptions)

  switch (method) {
    // GET /api/nft/[id]
    // gets unique nft by id
    case "GET":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false })
        }
        const nft = await prisma.nft_data.findUnique({
          where: { id: query.id }
        })
        res.status(200).json({ success: true, data: nft })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}