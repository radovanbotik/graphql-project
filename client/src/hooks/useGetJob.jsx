import { useEffect, useState } from "react";
import { fetchJob } from "../graphql/queries";

export function useGetJob(id) {
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob(id)
      .then(job => setJob(job))
      .catch(error => console.log(error));
  }, [id]);
  return job;
}
