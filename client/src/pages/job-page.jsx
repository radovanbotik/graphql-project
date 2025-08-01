import { Link, useParams } from "react-router";
import { useGetJob } from "../hooks/useGetJob";

export default function JobPage() {
  const { jobId } = useParams();
  const job = useGetJob(jobId);

  if (!job) return <div>...loading skeleton...</div>;
  return (
    <div className="py-8 px-4">
      <section className="max-w-4xl mx-auto">
        <div className="shadow bg-gray-100 p-4">
          <h1 className="text-3xl">{job.title}</h1>
          <h2 className="text-xl">
            <Link className="underline" to={`/companies/${job.company.id}`}>
              {job.company.name}
            </Link>
          </h2>
          <div className="py-4">
            <div className="space-y-2">
              <p className="text-gray-600">Posted: {job.date}</p>
            </div>
            <p>{job.description}</p>
          </div>
        </div>

        <Link to={`/`} className=" px-3 py-2 bg-black text-white font-bold block text-center">
          back to home
        </Link>
      </section>
    </div>
  );
}
