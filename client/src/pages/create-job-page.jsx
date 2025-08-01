import { useNavigate } from "react-router";
import { useState } from "react";
import { createJob } from "../graphql/queries";
import { getAccessToken } from "../lib/auth";

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  let navigate = useNavigate();
  const token = getAccessToken();

  async function onSubmit(e) {
    e.preventDefault();
    const job = await createJob(title, description, token);
    console.log(job);
    if (job) return navigate(`/jobs/${job.id}`);
  }

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
          <button type="submit" className="w-full px-3 py-2 bg-black text-white font-bold block text-center">
            Add job
          </button>
        </form>
      </div>
    </div>
  );
}
