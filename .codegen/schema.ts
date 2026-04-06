/**
 * Hand-maintained operation result types for `@codegen/schema`.
 * Run `bun run codegen` with a reachable GraphQL schema to regenerate from the API.
 */

export enum TaskPaymentMethod {
  Cash = 'CASH',
  Card = 'CARD',
  BankTransfer = 'BANK_TRANSFER',
}

export type MeQuery = {
  me: {
    id: string
    email: string
    createdAt: unknown
  } | null
}

export type LoginMutation = {
  login: {
    token: string
    user: { id: string; email: string }
  } | null
}

export type RegisterMutation = {
  register: {
    token: string
    user: { id: string; email: string }
  } | null
}

export type ForgotPasswordMutation = {
  forgotPassword: {
    success: boolean
    resetToken?: string | null
  } | null
}

export type ResetPasswordMutation = {
  resetPassword: {
    token: string
    user: { id: string; email: string }
  } | null
}

export type CreateTaskMutation = {
  createTask: {
    id: string
    title: string
    description: string
    location?: string | null
    locationLat?: number | null
    locationLng?: number | null
    dateTime?: unknown
    category?: string | null
    priceOfferPence?: number | null
    paymentMethod?: string | null
    contactMethod?: string | null
  } | null
}

export type AddOfferMutation = {
  addOffer: {
    id: string
    pricePence: number
    message?: string | null
  } | null
}

export type TaskQueryOffer = {
  id: string
  taskId: string
  pricePence: number
  message?: string | null
  workerUserId: string
  status: string
  createdAt: unknown
}

export type TaskQuery = {
  task: {
    id: string
    title: string
    description: string
    location?: string | null
    status: string
    createdByUserId: string
    createdAt: unknown
    dateTime?: string | null
    category?: string | null
    priceOfferPence?: number | null
    paymentMethod?: string | null
    contactMethod?: string | null
    offers: TaskQueryOffer[]
  } | null
}
