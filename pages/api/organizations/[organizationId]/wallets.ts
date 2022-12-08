// api/organizations.js
import { unstable_getServerSession } from "next-auth";
import checkApiKey from "../../../../lib/checkApiKey";
import { authOptions } from "../../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const { method } = req;
  const { organizationId } = req.query;


  const prisma = new PrismaClient();
  await prisma.$connect();
  // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions);

  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key']);
        console.log(req.headers['x-api-key'], { authorized });
        if (!authorized) {
          return res.status(403).json({ success: false });
        }
        const organization = await prisma.organizations.findUnique(
          { where: { id: organizationId }, include: { wallets: true } });
        res.status(200).json({ success: true, data: organization.wallets });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key']);
        console.log(req.headers['x-api-key'], { authorized });
        if (!authorized) {
          return res.status(403).json({ success: false });
        }
        const { address, chain } = req.body;
        const wallet = await prisma.wallets.create({
          data: {
            chain,
            address,
            organizations: {
              connect: {
                id: organizationId
              }
            }
          },
        });
        res.status(201).json({ success: true, data: { wallet } });
      } catch (error) {
        console.log({ error })
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
