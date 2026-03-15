'use client'

import { ApolloClient, InMemoryCache, from } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { createHttpLink } from '@apollo/client/link/http'

import { clearAuthToken, getAuthToken } from './auth'
import { isUnauthenticatedError } from './graphqlErrors'

const httpLink = createHttpLink({
  // Prefer a full URL (recommended): https://handyman-apollo.onrender.com/graphql
  uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/graphql`,
})

const authLink = setContext((_, { headers }) => {
  const token = getAuthToken()
  if (!token) {
    return { headers }
  }

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  }
})

const errorLink = onError(({ error }) => {
  if (isUnauthenticatedError(error)) {
    clearAuthToken()
  }
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})
