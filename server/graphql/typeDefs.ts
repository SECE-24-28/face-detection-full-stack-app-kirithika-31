import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Detection {
    id: ID!
    imageName: String!
    age: Int!
    gender: String!
    faceCount: Int!
    createdAt: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    detections: [Detection!]!
  }

  type Mutation {
    signup(
      name: String!
      email: String!
      password: String!
    ): AuthResponse!

    login(
      email: String!
      password: String!
    ): AuthResponse!

    createDetection(
      imageName: String!
      age: Int!
      gender: String!
      faceCount: Int!
      userId: Int!
    ): Detection!
  }
`;