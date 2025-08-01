import { CompanyCard } from "../components/CompanyCard";
import { useGetCompany } from "../hooks/useGetCompany";
import { Link, useParams } from "react-router";

export default function CompanyPage() {
  const { companyId } = useParams();

  const state = useGetCompany(companyId);

  if (state.loading) return <div>...loading skeleton...</div>;
  if (state.error) return <div className="shadow bg-red-100 p-4">...somethign went wrong...</div>;

  return (
    <div className="py-8 px-4">
      <section className="max-w-4xl mx-auto space-y-6">
        <CompanyCard name={state.company.name} description={state.company.description} />
        <div>
          <ul className="space-y-3">
            {state.company.jobs.map(job => (
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
