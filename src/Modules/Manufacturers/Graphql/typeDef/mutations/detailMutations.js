import { gql } from 'apollo-server-express';

const detailsMutations = gql`
type Mutation {
    addManufacturer(name: String!): Manufacturer
    addModel(name: String!, year: Int!, manufacturerid: ID!): Model
}
`;

export default detailsMutations;