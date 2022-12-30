import prisma from "prisma/client"

const checkApiKey = async (apiKey: string) => {
  return true // TODO: REMOVE WHEN DONE TESTING <<<<<<<<<<<
  const user = await prisma.users.findUnique({ where: { api_key: apiKey } })
  if (user) {
    return true
  }
  return false
}

export default checkApiKey