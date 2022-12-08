import { PrismaClient } from "@prisma/client"
// @ts-ignore
import checkApiKey from "/lib/checkApiKey"

export default async function handler(req, res) {
  const { method, query } = req

  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false })
        }
        const prisma = new PrismaClient()
        await prisma.$connect()
        const organizations = await prisma.organizations.findMany()
        await prisma.$disconnect()
        res.status(200).json({ success: true, data: organizations })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false })
      }
      break
    case "POST":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key'])
        console.log(req.headers['x-api-key'], { authorized })
        if (!authorized) {
          return res.status(403).json({ success: false })
        }
        const { wallets, initiatives, ...organization } = req.body
        const prisma = new PrismaClient()
        await prisma.$connect()
        const createdOrg = await prisma.organizations.create({
          data: {...organization},
        })
        await prisma.$disconnect()
        res.status(201).json({ success: true, data: createdOrg })
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
