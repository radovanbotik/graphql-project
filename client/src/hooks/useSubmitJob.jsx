import { useState } from "react";

export function useSubmitJob() {
  const [state, setState] = useState({
    job: null,
    loading: true,
    error: false,
  });

  return <></>;
}
