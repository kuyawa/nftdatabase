import prisma from "prisma/client"
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  let { method, headers, query } = req
  switch (method) {
    // GET /api/offers[?page=0&size=100]
    // gets a list of recently created offers
    // page and size are optional
    case "GET":
      try {
        let authorized = await checkApiKey(headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' })
        }
        let page = query?.page || 0
        let size = query?.size || 100
        if(page<0){ page = 0 }
        if(size<0){ size = 100 }
        let start = page * size
        let data = await prisma.offers.findMany({ 
          include: {
            artwork: { 
              include: { author: true} 
            },
            seller: true,
            beneficiary: true
          },
          skip: start, 
          take: size, 
          orderBy: {created: 'desc'} 
        })
        res.status(200).json({ success: true, data: data })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false, error:error.message })
      }
      break
    // POST /api/offers {form:data}
    // Creates a new entry in the offers table
    case "POST":
      try {
        let authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error: 'Not authorized' })
        }
        let record = req.body
        let result = await prisma.offers.create({record})
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    case "PUT":
      try {
        let authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error: 'Not authorized' })
        }
        let data = req.body
        let {id, ...newData} = data
        let result = await prisma.offers.update({
          where: {id: id},
          data: newData
        })
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.error('REGISTRY ERROR', { error })
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      return res.status(400).json({ success: false, error: 'Invalid HTTP method' })
      break
  }
}