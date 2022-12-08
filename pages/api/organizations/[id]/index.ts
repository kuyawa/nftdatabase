// api/organizations.js
import { PrismaClient } from "@prisma/client"
// @ts-ignore
import checkApiKey from "/lib/checkApiKey"

export default async function handler(req, res) {
  const { method } = req
  const { organizationId } = req.query

  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key'])
        console.log(req.headers['x-api-key'], { authorized })
        if (!authorized) {
          return res.status(403).json({ success: false })
        }
        const prisma = new PrismaClient()
        await prisma.$connect()
        const organization = await prisma.organizations.findUnique({
          where: { id: organizationId }
        })
        await prisma.$disconnect()
        res.status(200).json({ success: true, data: organization })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
