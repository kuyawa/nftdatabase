import prisma from "prisma/client"
import checkApiKey from "lib/checkApiKey"

// GET /api/users/byname?name
// Get user by name
// name must be lowercase
// Returns an object if found
export default async function handler(req, res) {
  const { method, headers, query } = req;
  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(headers['x-api-key']);
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' });
        }
        const data = await prisma.users.findFirst({
          where: {name: query.name},
          include: { 
            artworks: { 
              include: { author: true} 
            }, 
            collections: true 
          }
        })
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
