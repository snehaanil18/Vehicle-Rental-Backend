import { gql } from 'apollo-server-express'

const detailQueries = gql`
type Query {
    getAllManufacturers: [Manufacturer]
    getModelsByManufacturer(manufacturerid: ID!): [Model]
    getAllModels: [Model]
}
`;

export default detailQueries;