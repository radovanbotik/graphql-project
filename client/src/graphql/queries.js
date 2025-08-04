import { getAccessToken } from "../lib/auth";
import { ApolloClient, InMemoryCache, gql, concat, from, HttpLink, createHttpLink, ApolloLink } from "@apollo/client";

const ENDPOINT = "http://localhost:9000/graphql";

const httpLink = new HttpLink({
  uri: ENDPOINT,
});

const addAuthLink = new ApolloLink((operation, forward) => {
  //operation is an object which represents graphql query or mutation
  const token = getAccessToken();
  // if (token)
  //   return operation.setContext({
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  if (token) {
    operation.setContext(({ headers }) => ({
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    }));
  }
  return forward(operation);
});

//concat allows us to chain graphql links
const apolloClient = new ApolloClient({
  link: concat(addAuthLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   watchQuery: {
  //     fetchPolicy: "network-only",
  //   },
  // },
});
console.log(apolloClient);
export async function fetchJobs() {
  const QUERY = gql`
    query Jobs {
      jobs {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `;

  try {
    const result = await apolloClient.query({ query: QUERY, fetchPolicy: "network-only" });
    console.log(result);
    return result.data.jobs;
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchJob(id) {
  const variables = {
    id: id,
  };

  const QUERY = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        title
        description
        date
        company {
          id
          name
        }
      }
    }
  `;
  try {
    const result = await apolloClient.query({ query: QUERY, variables: variables });
    return result.data.job;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function fetchCompany(id) {
  const QUERY = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
          description
          date
        }
      }
    }
  `;
  const variables = {
    id: id,
  };
  try {
    const result = await apolloClient.query({ query: QUERY, variables: variables });
    return result.data.company;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createJob(title, description) {
  //mutation will first return the fields below which we will use in query
  const MUTATION = gql`
    mutation createJob($input: CreateJobInput!) {
      createJob(input: $input) {
        id
        title
        description
        date
        company {
          id
          name
        }
      }
    }
  `;
  const QUERY = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        title
        description
        date
        company {
          id
          name
        }
      }
    }
  `;
  const variablesMutation = {
    input: {
      title: title,
      description: description,
    },
  };

  try {
    //originally we had to make 2 requests:
    //1. mutate data and 2. fetch the new job
    //update function will allow us to only make a single request. it will be called when we receive response.
    //we are writing to the cache to avoid additional request
    const result = await apolloClient.mutate({
      mutation: MUTATION,
      variables: variablesMutation,
      update: (cache, result) => {
        cache.writeQuery({
          query: QUERY,
          variables: { id: result.data.createJob.id },
          //QUERY's NAME IS JOB see above
          data: { job: result.data.createJob },
        });
      },
    });
    return result.data.createJob;
  } catch (error) {
    console.log(error);
  }
}
