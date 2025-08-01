import { useEffect, useState } from "react";
import { fetchJobs } from "../graphql/queries";

export function useGetJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs()
      .then(jobs => setJobs(jobs))
      .catch(err => console.log("error is:", err));
  }, []);

  return jobs;
}
