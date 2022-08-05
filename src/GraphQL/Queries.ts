import { gql } from '@apollo/client';


const LOAD_KOVAN = gql`
query kovan($page: String!, $vehicle_type:String!, $bike_id:String!){
  kovanmodel(page:$page,vehicle_type:$vehicle_type) {
    total_count
    ttl    
    data {
      bikes(
        where: {
          and: [{ vehicle_type: { contains: "" }, bike_id: { contains: $bike_id } }]
        }
        order: { bike_id: ASC }
      ) {
        items {
          bike_id
          vehicle_type
          total_bookings
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }    
    }   
  }
}
`


const LOAD_BIKEDETAIL = gql`
query kovan($bike_id:String!){
  kovanbikedetailmodel ( bike_id: $bike_id) {
    data {
      bike {
          bike_id
          lat
          lon
          is_reserved
          is_disabled
          vehicle_type
          total_bookings
          android
          ios        
      }
    }
  }
}
`

export { LOAD_KOVAN, LOAD_BIKEDETAIL };