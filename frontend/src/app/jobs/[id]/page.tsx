import { FaArrowLeft } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";
import { Job } from "@/types/job";
import JobDetailCard from "@/app/components/JobDetailCard";

async function getJob(id: string): Promise<Job> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Job nicht gefunden");
  return response.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let job: Job | null = null;
  let error: string | null = null;

  try {
    job = await getJob(resolvedParams.id);
  } catch (err) {
    error = "Job konnte nicht geladen werden";
    console.error(err);
  }

  if (error || !job) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || "Job nicht gefunden"}
        </div>
        <Link href="/" className="btn btn-secondary">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link href="/" className="btn btn-outline-secondary mb-4">
        <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
        Zurück zur Übersicht
      </Link>

      <JobDetailCard job={job} />
    </div>
  );
}
