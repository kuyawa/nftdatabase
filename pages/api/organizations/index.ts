// api/organizations.js
import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import checkApiKey from "../../../lib/checkApiKey";
import { authOptions } from "../auth/[...nextauth]";

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     description: gets a list of organizations
 *     responses:
 *       200:
 *         description: List of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 $ref: '#/models/Organization'
 */
export default async function handler(req, res) {
  const { method, query } = req;

  const prisma = new PrismaClient();
  await prisma.$connect();
  // @ts-ignore
  // const session = await unstable_getServerSession(req, res, authOptions);

  switch (method) {
    case "GET":
      try {
        const authorized = await checkApiKey(req.headers['x-api-key']);
        // console.log(req.headers['x-api-key'], { authorized });
        if (!authorized) {
          return res.status(403).json({ success: false });
        }
        const organizations = await prisma.organizations.findMany(
          {
            where: {
              category: {
                slug: query.category,
              },
              wallets: {
                every: {
                  address: query.wallet
                }
              }
            },
            include: { category: true, wallets: true }
          });
        res.status(200).json({ success: true, data: organizations });
      } catch (error) {
        console.log({ error })
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

        const { wallets, initiatives, ...organization } = req.body;

        const createdOrg = await prisma.organizations.create({
          data: {
            ...organization,
            wallets: { create: wallets },
            initiatives: { set: initiatives },
          },
        });
        res.status(201).json({ success: true, data: createdOrg });
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
