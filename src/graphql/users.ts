import { gql } from '@apollo/client'

export const PROFESSIONAL_PROFILE_QUERY = gql`
  query ProfessionalProfile($id: ID!) {
    professionalProfile(id: $id) {
      id
      bio
      isVerified
      rating
      reviewCount
      yearsExperience
      location {
        address
        lat
        lng
      }
      skills {
        id
        name
      }
    }
  }
`

export const SEARCH_PROFESSIONALS_QUERY = gql`
  query SearchProfessionals($location: String, $skill: String) {
    searchProfessionals(location: $location, skill: $skill) {
      id
      bio
      rating
      reviewCount
      user {
        id
        firstName
        lastName
      }
    }
  }
`

export const WORKER_QUERY = gql`
  query Worker($id: ID!) {
    worker(id: $id) {
      workerUserId
      averageRating
      reviewCount
    }
  }
`

export const REGISTER_AS_PRO_MUTATION = gql`
  mutation RegisterAsPro($input: ProRegistrationInput!) {
    registerAsPro(input: $input) {
      id
      isProMember
    }
  }
`

export const UPDATE_MY_MEMBERSHIP_MUTATION = gql`
  mutation UpdateMyMembership($input: UpdateMyMembershipInput!) {
    updateMyMembership(input: $input) {
      isPaid
      tier
      renewsAt
    }
  }
`

export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      id
      profile {
        name
        contactNumber
      }
    }
  }
`

export const UPDATE_MY_SETTINGS_MUTATION = gql`
  mutation UpdateMySettings($input: UpdateMySettingsInput!) {
    updateMySettings(input: $input) {
      id
      settings {
        isProfilePrivate
        marketingEmails
      }
    }
  }
`

export const UPGRADE_TO_PRO_MEMBERSHIP_MUTATION = gql`
  mutation UpgradeToProMembership {
    upgradeToProMembership {
      id
      isProMember
    }
  }
`
