import prisma from "prisma/client"
import checkApiKey from "lib/checkApiKey"

export default async function handler(req, res) {
  let { method, headers, query } = req
  switch (method) {
    // GET /api/collections[?page=0&size=100]
    // gets a list of recently created collections
    // page and size are optional
    case "GET":
      try {
        let authorized = await checkApiKey(headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' })
        }
        let page = parseInt(query?.page || 0)
        let size = parseInt(query?.size || 100)
        if(page<0){ page = 0 }
        if(size<0){ size = 100 }
        let start = page * size
        let data = await prisma.collections.findMany({
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
    // POST /api/collections {form:data}
    // Creates a new entry in the collections table
    case "POST":
      try {
        let authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error: 'Not authorized' })
        }
        let data = req.body
        let result = await prisma.collections.create({data: data})
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      return res.status(400).json({ success: false, error: 'Invalid HTTP method' })
      break
  }
}