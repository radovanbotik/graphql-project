import { useQuery } from "@apollo/client";
import { CompanyCard } from "../components/CompanyCard";
import { Link, useParams } from "react-router";
import { getCompanyByIdQuery } from "../graphql/queries";

export default function CompanyPage() {
  const { companyId } = useParams();
  const result = useQuery(getCompanyByIdQuery, {
    variables: { id: companyId },
  });

  if (result.loading) return <div>...loading skeleton...</div>;
  if (result.error) return <div className="shadow bg-red-100 p-4">{result.error.message}</div>;

  return (
    <div className="py-8 px-4">
      <section className="max-w-4xl mx-auto space-y-6">
        <CompanyCard name={result.data.company.name} description={result.data.company.description} />
        <div>
          <ul className="space-y-3">
            {result.data.company.jobs.map(job => (
              <li key={job.id}>
                <div className="shadow bg-gray-100 flex items-center justify-between p-4">
                  <span>{job.title}</span>
                  <Link to={`/jobs/${job.id}`} className="inline-block px-3 py-2 bg-black text-white font-bold">
                    Preview role
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Link to={`/`} className=" px-3 py-2 bg-black text-white font-bold block text-center">
          back to home
        </Link>
      </section>
    </div>
  );
}
