import { gql } from "apollo-boost";

// Posts queries
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
    }
  }
`;

// User Queries

// Posts mutations

// User mutations