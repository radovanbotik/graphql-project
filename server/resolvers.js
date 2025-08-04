import { GraphQLError } from "graphql";
import { getCompany } from "./database/companies.js";
import { countJobs, createJob, deleteJob, getJob, getJobs, getJobsByCompanyId, updateJob } from "./database/jobs.js";

export const resolvers = {
  Query: {
    jobs: async (_root, args) => {
      const jobs = await getJobs(args.limit, args.offset);
      return {
        jobs: jobs,
        totalCount: await countJobs(),
      };
    },
    job: async (_root, args) => {
      const job = await getJob(args.id);
      if (!job) {
        throw notFoundError(`There is no job with id :${args.id}`);
      }
      return job;
    },
    company: async (_root, args) => {
      const company = await getCompany(args.id);
      if (!company) {
        throw notFoundError(`There is no company with id :${args.id}`);
      }
      return company;
    },
  },
  Job: {
    date: self => toIsoDate(self.createdAt),
    //That ids array — [5, 2, 9] — is generated automatically by DataLoader when you (or GraphQL) call:
    //These .load() calls are made as part of resolving fields in your GraphQL resolvers.
    //DataLoader collects those in the order they’re called, and then calls your batch function with that ordered array.
    company: (self, _args, context) => context.companyLoader.load(self.companyId),
  },
  Company: {
    jobs: self => getJobsByCompanyId(self.id),
  },
  // prevent unauthorised users from creating new jobs using context
  Mutation: {
    createJob: (_root, { input }, context) => {
      if (!context.user) throw unauthorizedError("User must be authenticated first");
      return createJob({ companyId: context.user.companyId, title: input.title, description: input.description });
    },
    deleteJob: async (_root, { input }, context) => {
      if (!context.user) throw unauthorizedError("User must be authenticated first");
      const job = await deleteJob(input.id, context.user.companyId);
      if (!job) {
        throw notFoundError(`There is no job with id :${input.id} created by your organisation`);
      }
      return job;
    },
    updateJob: async (_root, { input }, context) => {
      if (!context.user) throw unauthorizedError("User must be authenticated first");
      const job = await updateJob({
        id: input.id,
        title: input.title,
        description: input.description,
        companyId: context.user.companyId,
      });
      if (!job) {
        throw notFoundError(`There is no job with id :${input.id} created by your organisation`);
      }
      return job;
    },
  },
};

function toIsoDate(isoString) {
  return isoString.slice(0, "yyyy-mm-dd".length);
}

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}
function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" },
  });
}
