import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router";
import { getJobByIdQuery } from "../graphql/queries";

export default function JobPage() {
  const { jobId } = useParams();
  const result = useQuery(getJobByIdQuery, {
    variables: {
      id: jobId,
    },
    fetchPolicy: "cache-first",
  });

  if (result.loading) return <div>...loading skeleton...</div>;
  if (result.error) return <div className="shadow bg-red-100 p-4">{result.error.message}</div>;

  return (
    <div className="py-8 px-4">
      <section className="max-w-4xl mx-auto">
        <div className="shadow bg-gray-100 p-4">
          <h1 className="text-3xl">{result.data.job.title}</h1>
          <h2 className="text-xl">
            <Link className="underline" to={`/companies/${result.data.job.company.id}`}>
              {result.data.job.company.name}
            </Link>
          </h2>
          <div className="py-4">
            <div className="space-y-2">
              <p className="text-gray-600">Posted: {result.data.job.date}</p>
            </div>
            <p>{result.data.job.description}</p>
          </div>
        </div>

        <Link to={`/`} className=" px-3 py-2 bg-black text-white font-bold block text-center">
          back to home
        </Link>
      </section>
    </div>
  );
}
