/**
 * Types for `TASKS_QUERY` in `tasks.ts`. Replace with `@codegen/schema` once
 * `bun run codegen` succeeds against the production GraphQL endpoint.
 */
export type TaskOfferListItem = {
  id: string
  taskId: string
  workerUserId: string
  pricePence: number
  message?: string | null
  status: string
  createdAt: unknown
}

export type TaskListItem = {
  id: string
  title: string
  description: string
  location?: string | null
  status: string
  createdByUserId: string
  createdAt: unknown
  dateTime?: unknown
  category?: string | null
  priceOfferPence?: number | null
  paymentMethod?: string | null
  contactMethod?: string | null
  offers: TaskOfferListItem[]
}

export type TasksQueryData = {
  tasks: {
    items: TaskListItem[]
    pageInfo: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}
