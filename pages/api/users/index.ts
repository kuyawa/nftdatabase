import { PrismaClient } from "@prisma/client";
// @ts-ignore
import checkApiKey from "/lib/checkApiKey";

// List of users
export default async function handler(req, res) {
  const { method, headers } = req;

  console.log('USERS')
  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(headers['x-api-key']);
        if (!authorized) {
          console.log('ERROR: not authorized');
          return res.status(403).json({ success: false, error:'Not authorized' });
        }
        const prisma = new PrismaClient();
        await prisma.$connect();
        const data = await prisma.users.findMany();
        await prisma.$disconnect();
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
        const prisma = new PrismaClient();
        await prisma.$connect();
        let result = await prisma.users.create({data: data})
        await prisma.$disconnect();
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.error('REGISTRY ERROR', { error })
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
        const prisma = new PrismaClient()
        await prisma.$connect()
        let result = await prisma.users.update({
          where: {id: id},
          data: newData
        })
        await prisma.$disconnect();
        return res.status(201).json({ success: true, data: result })
      } catch (error) {
        console.error('REGISTRY ERROR', { error })
        return res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      res.status(400).json({ success: false, error:'HTTP method not supported' });
      break;
  }
}
