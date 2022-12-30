import prisma from "prisma/client"
import checkApiKey from "lib/checkApiKey"

// GET /api/offers/[id]
// get offer by id
export default async function handler(req, res) {
  let { method, headers, query } = req
  switch (method) {
    case "GET":
      try {
        let authorized = await checkApiKey(headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' })
        }
        let data = await prisma.offers.findUnique({
          where: {id: query.id},
          include: {collection:true, artwork:true, seller: true, buyer: false, beneficiary:true}
        })
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