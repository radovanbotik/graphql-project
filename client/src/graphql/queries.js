import { gql, GraphQLClient } from "graphql-request";

const ENDPOINT = "http://localhost:9000/graphql";
const client = new GraphQLClient(ENDPOINT);

export async function fetchJobs() {
  const QUERY = gql`
    {
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
    const result = await client.request(QUERY);
    return result.jobs;
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
    const result = await client.request(QUERY, variables);
    return result.job;
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
    const result = await client.request(QUERY, variables);
    return result.company;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createJob(title, description, token) {
  const QUERY = gql`
    mutation createJob($input: CreateJobInput!) {
      createJob(input: $input) {
        date
        description
        id
        title
      }
    }
  `;
  const variables = {
    input: {
      title: title,
      description: description,
    },
  };

  const requestHeaders = {
    authorization: `Bearer ${token}`,
  };

  try {
    const result = await client.request(QUERY, variables, requestHeaders);
    console.log(result);
    return result.createJob;
  } catch (error) {
    console.log(error);
  }
}
