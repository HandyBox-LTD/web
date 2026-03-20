import { gql } from '@apollo/client'

export const ADD_REVIEW_MUTATION = gql`
  mutation AddReview($input: AddReviewInput!) {
    addReview(input: $input) {
      id
      rating
      comment
      createdAt
    }
  }
`

export const ENDORSE_PROFESSIONAL_MUTATION = gql`
  mutation EndorseProfessional($comment: String, $professionalId: ID!, $skillId: ID!) {
    endorseProfessional(comment: $comment, professionalId: $professionalId, skillId: $skillId) {
      id
      comment
      createdAt
    }
  }
`

export const RATE_PROFESSIONAL_MUTATION = gql`
  mutation RateProfessional($input: RateProfessionalInput!) {
    rateProfessional(input: $input) {
      id
      rating
      comment
      communicationRating
      punctualityRating
      workQualityRating
    }
  }
`
