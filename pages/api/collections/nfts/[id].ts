import { PrismaClient } from "@prisma/client"
// @ts-ignore
import checkApiKey from "/lib/checkApiKey"

export default async function handler(req, res) {
  let { method, headers, query } = req
  console.log('- COLLECTIONS/NFTS', method)
  switch (method) {
    // GET /api/collections/nfts[?page=0&size=100]
    // gets nfts by collection
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
        console.log('START', start, 'PAGE', page, 'SIZE', size)
        let prisma = new PrismaClient()
        await prisma.$connect()
        let data = await prisma.artworks.findMany({ 
          include:{
            author: true
          },
          where: { collectionId: query.id},
          skip: start,
          take: size, 
          orderBy: {created: 'desc'}
        })
        await prisma.$disconnect()
        console.log(data?.length||0, 'rows')
        res.status(200).json({ success: true, data: data })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false, error:error.message })
      }
      break
    // POST /api/artworks {form:data}
    // create new nft artwork
    case "POST":
      try {
        let authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error: 'Not authorized' })
        }
        let data = req.body
        let prisma = new PrismaClient()
        await prisma.$connect()
        let result = await prisma.artworks.create({data: data})
        await prisma.$disconnect()
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.error('REGISTRY ERROR', { error })
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      res.status(400).json({ success: false, error:'HTTP method not accepted' })
      break
  }
}