import { useQuery } from "@apollo/client";
import { JobCard } from "../components/JobCard";
import { getJobsQuery } from "../graphql/queries";

export default function HomePage() {
  const result = useQuery(getJobsQuery, {
    fetchPolicy: "network-only",
  });

  if (result.loading) return <div>...loading skeleton...</div>;
  if (result.error) return <div className="shadow bg-red-100 p-4">{result.error.message}</div>;

  return (
    <div className="py-8 px-4">
      <section className="max-w-4xl mx-auto">
        <ul className="space-y-8">
          {result.data.jobs.map(job => (
            <li key={job.id}>
              <JobCard
                jobId={job.id}
                jobTitle={job.title}
                jobDescription={job.description}
                companyName={job.company.name}
                companyId={job.company.id}
                date={job.date}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
