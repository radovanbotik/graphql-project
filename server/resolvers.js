import { GraphQLError } from "graphql";
import { getCompany } from "./database/companies.js";
import { createJob, deleteJob, getJob, getJobs, getJobsByCompanyId, updateJob } from "./database/jobs.js";
import { getUser } from "../client/src/lib/auth.js";

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
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
    company: self => getCompany(self.companyId),
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
