// api/categories.js
import { PrismaClient } from "@prisma/client";
import checkApiKey from "../../../lib/checkApiKey";

export default async function handler(req, res) {
  const { method, headers } = req;

  const prisma = new PrismaClient();
  await prisma.$connect();
  // const session = await unstable_getServerSession(req, res, authOptions);

  switch (method) {
    case "GET":
      try {
        console.log('get');
        const authorized = await checkApiKey(headers['x-api-key']);
        console.log({ authorized });
        if (!authorized) {
          console.log('not authorized');
          return res.status(403).json({ success: false });
        }
        console.log('getting categories');
        // const categories = await Category.find({});
        const categories = await prisma.categories.findMany();
        console.log('got categories');
        console.log({ categories });
        res.status(200).json({ success: true, data: categories });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
