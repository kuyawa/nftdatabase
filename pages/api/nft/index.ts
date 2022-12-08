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
    // GET /api/nft[?page=0&limit=100]
    // gets a list of recently minted nfts order by created desc
    case "GET":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false })
        }
        let page   = req.query.page  || 0
        let limit  = req.query.limit || 100
        let offset = page * limit
        let nfts   = await prisma.nft_data.findMany({ skip: offset, take: limit, orderBy: {created: 'desc'} })
        res.status(200).json({ success: true, data: nfts })
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false })
      }
      break
    // POST /api/nft {nft:data}
    // Creates a new entry in the nft_data table:
    //   created        DateTime
    //   donorAddress   String
    //   organizationId String
    //   metadataUri    String    ipfs:metadataID
    //   imageUri       String    ipfs:imageID
    //   network        String    mainnet testnet devnet
    //   coinLabel      String    Ripple Solana etc
    //   coinSymbol     String    XRP SOL etc
    //   coinValue      String
    //   usdValue       String
    //   tokenId        String
    //   offerId        String
    //   status         Int       0.minted 1.accepted 2.declined
    case "POST":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          let message = 'Unauthorized, check your API key is present in HTTP headers'
          console.error(message)
          return res.status(403).json({ success: false, error: message })
        }
        const data = req.body
        const createdNFT = await prisma.nft_data.create({data: data})
        return res.status(201).json({ success: true, data: createdNFT })
      } catch (error) {
        console.error('REGISTRY ERROR', { error })
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      let message = 'Invalid HTTP method, only GET and POST accepted'
      console.error(message)
      return res.status(400).json({ success: false, error: message })
      break
  }
}