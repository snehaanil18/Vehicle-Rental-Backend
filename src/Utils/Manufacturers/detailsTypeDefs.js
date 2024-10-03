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
}

type Query {
    getAllManufacturers: [Manufacturer]
    getModelsByManufacturer(manufacturerId: ID!): [Model]
}
`
export default detailsTypeDef;