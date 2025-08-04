import { useNavigate } from "react-router";
import { useState } from "react";
import { createJobMutation, getJobByIdQuery } from "../graphql/queries";
import { useMutation } from "@apollo/client";

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  let navigate = useNavigate();
  const [mutate, result] = useMutation(createJobMutation);

  async function onSubmit(e) {
    e.preventDefault();
    const result = await mutate({
      variables: {
        input: {
          title: title,
          description: description,
        },
      },
      update: (cache, result) => {
        cache.writeQuery({
          query: getJobByIdQuery,
          variables: { id: result.data.createJob.id },
          data: { job: result.data.createJob },
        });
      },
    });
    if (result.data.createJob) return navigate(`/jobs/${result.data.createJob.id}`);
  }

  if (result.loading) return <div>...loading skeleton...</div>;
  if (result.error) return <div className="shadow bg-red-100 p-4">{result.error.message}</div>;

  return (
    <div className="py-8 px-4">
      <div className="p-2 bg-gray-100">
        <h1 className="text-2xl font-bold">Create new job</h1>
        <form onSubmit={onSubmit}>
          <div className="">
            <label htmlFor="title">Role</label>
            <input
              name="title"
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="bg-white w-full"
            />
          </div>
          <div className="">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={6}
              className="bg-white w-full"
            />
          </div>
          <button
            disabled={result.loading}
            type="submit"
            className="w-full px-3 py-2 bg-black text-white font-bold block text-center disabled:bg-gray-600"
          >
            Add job
          </button>
        </form>
      </div>
    </div>
  );
}
