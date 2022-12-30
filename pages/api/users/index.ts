import prisma from "prisma/client"
import checkApiKey from "lib/checkApiKey"

// List of users
export default async function handler(req, res) {
  const { method, headers } = req;
  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(headers['x-api-key']);
        if (!authorized) {
          return res.status(403).json({ success: false, error:'Not authorized' });
        }
        const data = await prisma.users.findMany();
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
    case "PUT":
      try {
        let authorized = await checkApiKey(req.headers['x-api-key'])
        if (!authorized) {
          return res.status(403).json({ success: false, error: 'Not authorized' })
        }
        let data = req.body
        let {id, ...newData} = data
        let result = await prisma.users.update({
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
      res.status(400).json({ success: false, error:'HTTP method not supported' });
      break;
  }
}
