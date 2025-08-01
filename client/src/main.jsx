import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/home-page";
import CompanyPage from "./pages/company-page";
import JobPage from "./pages/job-page";
import CreateJobPage from "./pages/create-job-page";
import LoginPage from "./pages/login-page";
import "./index.css";
import { RootLayout } from "./pages/root-layout";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="companies/:companyId" element={<CompanyPage />} />
          <Route path="jobs/:jobId" element={<JobPage />} />
          <Route path="jobs/new" element={<CreateJobPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
