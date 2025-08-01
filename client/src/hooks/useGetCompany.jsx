import { useEffect } from "react";
import { useState } from "react";
import { fetchCompany } from "../graphql/queries";

export function useGetCompany(id) {
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    fetchCompany(id)
      .then(company =>
        setState({
          company: company,
          loading: false,
          error: false,
        })
      )
      .catch(error =>
        setState({
          company: null,
          loading: false,
          error: true,
        })
      );
  }, [id]);

  return state;
}
