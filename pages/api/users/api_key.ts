import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { v4 as uuidv4 } from 'uuid';

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;

  const prisma = new PrismaClient();
  await prisma.$connect();
  // @ts-ignore
  const session = await unstable_getServerSession(req, res, authOptions);

  switch (method) {
    // case "GET":
    //   try {
    //     const organizations = await Organization.find({});
    //     res.status(200).json({ success: true, data: organizations });
    //   } catch (error) {
    //     res.status(400).json({ success: false });
    //   }
    //   break;
    case "PUT":
      try {
        console.log({ body: req.body });
        const {
          // @ts-ignore
          user: { id: userId },
        } = session;

        console.log('get UUID', uuidv4);
        const apiKey = uuidv4();
        console.log({ apiKey });


        const user = await prisma.users.update(
          {
            where: { id: userId },
            data: { api_key: apiKey }
          }
        );
        console.log({ user });

        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
