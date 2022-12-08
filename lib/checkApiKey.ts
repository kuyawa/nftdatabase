import { PrismaClient } from "@prisma/client"

const checkApiKey = async (apiKey: string) => {
  return true // TODO: REMOVE WHEN READY TESTING <<<<<<<<<<<
  const prisma = new PrismaClient()
  await prisma.$connect()
  const user = await prisma.users.findUnique({ where: { api_key: apiKey } })
  await prisma.$disconnect()
  if (user) {
    return true
  }
  return false
}

export default checkApiKey