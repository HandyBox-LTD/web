'use client'

import { useMutation } from '@apollo/client/react'
import { Box, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'

import { ADD_OFFER } from '@/graphql/jobs'
import { Button } from '@/ui/Button/Button'
import type { AddOfferMutation } from '@codegen/schema'
import { GlassCard } from '../../ui/Card/GlassCard'
import { TextInput } from '../../ui/Input/TextInput'

export function LandingWorkerActions() {
  const [taskId, setTaskId] = useState('')
  const [pricePence, setPricePence] = useState('4500')
  const [message, setMessage] = useState('Can do this tomorrow afternoon')

  const [addOffer, { loading: quoting }] =
    useMutation<AddOfferMutation>(ADD_OFFER)

  return (
    <GlassCard p={6}>
      <Stack gap={4}>
        <Heading size="md">Handyman: submit an offer</Heading>
        <Text color="muted">
          Enter a task ID from the list above and submit your offer. Requires an
          authenticated session.
        </Text>
        <Grid templateColumns={{ base: '1fr', md: '1fr' }} gap={4}>
          <Stack gap={3}>
            <TextInput
              placeholder="Task ID"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
            />
            <TextInput
              placeholder="Price (pence)"
              value={pricePence}
              onChange={(e) => setPricePence(e.target.value)}
            />
            <TextInput
              placeholder="Message to the client"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              size="sm"
              background="linkBlue.600"
              color="white"
              loading={quoting}
              onClick={() =>
                addOffer({
                  variables: {
                    input: {
                      taskId,
                      pricePence: Number(pricePence) || 0,
                      message: message || undefined,
                    },
                  },
                })
              }
            >
              Submit offer
            </Button>
          </Stack>
        </Grid>
        <Box borderBottomWidth="1px" borderColor="border" />
        <Text color="muted" fontSize="sm">
          Note: these actions require an authenticated user session (JWT in
          cookie).
        </Text>
      </Stack>
    </GlassCard>
  )
}
