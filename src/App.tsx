import React from 'react';
import './App.css';
import CustomPaginationActionsTable from './CustomPaginationActionsTable';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from 'apollo-link-context';
import UserLogin from './UserLogin/UserLogin';
import Cookies from 'universal-cookie';

export const cookies = new Cookies();


function App() {
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);

  React.useEffect(() => {

    const token = cookies.get("authToken");
    if (token && token !== "") {
      setAuthenticated(true);
    }
    else {
      setAuthenticated(false);
    }
    return () => {
      cookies.remove("authToken");
    }
  }, []);

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        setAuthenticated(false);
        return alert(`Graphql error ${message}`);
      });
    }
  });

  const authLink: any = setContext((_, { headers }) => {
    const token = cookies.get("authToken");
    //const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBhZG1pbi5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiTWVtYmVyIiwiQWRtaW4iXSwiZXhwIjoxNjU5NzE4NzgyfQ.3Y1cMMmN1t6__cWVAD__mZpJoVBSkoVygaT_Yre9zqChiG8iy-9h52L7MnJ-gtzBQIMkJZGgtMDxIrcyv10n2w";
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  const httpLink = from([
    authLink,
    errorLink,
    new HttpLink({ uri: "http://localhost:5162/api/" })
  ]);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
  });





  return (
    <ApolloProvider client={client}>
      {
        authenticated ?
          <CustomPaginationActionsTable
            client={client}
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
          /> :
          <UserLogin
            client={client}
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
          />
      }
    </ApolloProvider>
  );
}

export default App;
