import { gql } from '@apollo/client'

export const GET_S3_UPLOAD_URL_QUERY = gql`
  query GetS3UploadUrl($bucket: Bucket!, $key: String!, $index: Int) {
    getS3UploadUrl(bucket: $bucket, key: $key, index: $index) {
      url
    }
  }
`
