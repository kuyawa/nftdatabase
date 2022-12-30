import prisma from "prisma/client"
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  const { method, query } = req

  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false })
        }
        const organizations = await prisma.organizations.findMany()
        res.status(200).json({ success: true, data: organizations })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false })
      }
      break
    case "POST":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false })
        }
        const record = req.body
        const createdOrg = await prisma.organizations.create({record})
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
