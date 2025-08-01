import { Link } from "react-router";

export function JobCard({ jobTitle, companyName, companyId, date, jobDescription, jobId }) {
  return (
    <div className="shadow bg-gray-100 p-4">
      <h1 className="text-3xl">{jobTitle}</h1>
      <h2 className="text-xl">
        <Link to={`/companies/${companyId}`} className="underline">
          {companyName}
        </Link>
      </h2>
      <div className="py-4">
        <div className="space-y-2">
          <p className="text-gray-600">Posted: {date}</p>
        </div>
        <p>{jobDescription}</p>
      </div>
      <Link to={`jobs/${jobId}`} className=" px-3 py-2 bg-black text-white font-bold">
        See position
      </Link>
    </div>
  );
}
