// Example usage of Prisma in your ShoreAgents project
import { prisma } from './prisma'

// Example: Create a new user
export async function createUser(email: string, name?: string) {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    })
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Example: Get user by email
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Example: Create a pricing quote
export async function createPricingQuote(data: {
  userId?: string
  sessionId?: string
  quoteTimestamp: Date
  memberCount: number
  industry: string
  totalMonthlyCost: number
  currencyCode: string
  quoteNumber: number
  candidateRecommendations?: any
}) {
  try {
    const quote = await prisma.pricingQuote.create({
      data,
    })
    return quote
  } catch (error) {
    console.error('Error creating pricing quote:', error)
    throw error
  }
}

// Example: Get pricing quotes by user
export async function getPricingQuotesByUser(userId: string) {
  try {
    const quotes = await prisma.pricingQuote.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return quotes
  } catch (error) {
    console.error('Error fetching pricing quotes:', error)
    throw error
  }
}

// Example: Update a pricing quote
export async function updatePricingQuote(id: string, data: any) {
  try {
    const quote = await prisma.pricingQuote.update({
      where: {
        id,
      },
      data,
    })
    return quote
  } catch (error) {
    console.error('Error updating pricing quote:', error)
    throw error
  }
}

// Example: Delete a pricing quote
export async function deletePricingQuote(id: string) {
  try {
    const quote = await prisma.pricingQuote.delete({
      where: {
        id,
      },
    })
    return quote
  } catch (error) {
    console.error('Error deleting pricing quote:', error)
    throw error
  }
}




