import { PrismaClient } from "@prisma/client";
// @ts-ignore
import checkApiKey from "/lib/checkApiKey";

// GET /api/users/name/[name]
// Get user by name
// name must be lowercase
// Returns an object if found
export default async function handler(req, res) {
  const { method, headers, query } = req;
  console.log('- USER BY NAME', query.name)
  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(headers['x-api-key']);
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' });
        }
        const prisma = new PrismaClient();
        await prisma.$connect();
        const data = await prisma.users.findFirst({
          where: {name: query.name},
          include: { 
            artworks: { 
              include: { author: true} 
            }, 
            collections: true 
          }
        })
        await prisma.$disconnect()
        if(data){
          return res.status(200).json({ success: true, data: data });
        }
        else {
          return res.status(200).json({ success: false, error: 'User not found' });
        }
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      return res.status(400).json({ success: false, error:'HTTP method not supported' });
      break;
  }
}
