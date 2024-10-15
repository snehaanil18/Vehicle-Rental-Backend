import { gql } from 'apollo-server-express';

const detailsTypeDef = gql`
type Manufacturer {
    id: ID!
    name: String!
}

type Model {
    id: ID!
    name: String!
    year: Int!
    manufacturerid: ID!
}
`;

export default detailsTypeDef;