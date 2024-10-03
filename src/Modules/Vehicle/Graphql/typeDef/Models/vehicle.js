import { gql } from 'apollo-server-express'

const vehicletypeDef = gql`

enum Transmission {
        MANUAL
        AUTOMATIC
        manual
        automatic
    }

    enum FuelType {
        DIESEL
        PETROL
        ELECTRIC
        HYBRID
        CNG        
        LPG        
        BIOFUEL 
        diesel
        petrol
        electric
        hybrid
        cng
    }

    type Vehicle {
        id: ID!
        name: String
        description: String
        price: Float!
        primaryimage: String
        otherimages: [String]
        model: String
        manufacturer: String
        vehicletype: String!
        quantity: Int!
        transmission: Transmission!
        fueltype: FuelType!
    }
`;

export default vehicletypeDef;