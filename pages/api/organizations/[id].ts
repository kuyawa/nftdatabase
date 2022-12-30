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
        const organization = await prisma.organizations.findUnique({
          where: { id: query.id }
        })
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
