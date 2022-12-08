import { PrismaClient } from "@prisma/client";
// @ts-ignore
import checkApiKey from "/lib/checkApiKey";

// List of users
export default async function handler(req, res) {
  const { method, headers } = req;
  const prisma = new PrismaClient();
  await prisma.$connect();

  console.log('USERS')
  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(headers['x-api-key']);
        if (!authorized) {
          console.log('ERROR: not authorized');
          return res.status(403).json({ success: false, error:'Not authorized' });
        }
        const data = await prisma.users.findMany();
        console.log('USERS2')
        res.status(200).json({ success: true, data: data });
      } catch (error) {
        console.error('ERROR:', error)
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        let authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error: 'Not authorized' })
        }
        let data = req.body
        let result = await prisma.users.create({data: data})
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.error('REGISTRY ERROR', { error })
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      console.log('USERS4')
      res.status(400).json({ success: false, error:'HTTP method not supported' });
      break;
  }
}
