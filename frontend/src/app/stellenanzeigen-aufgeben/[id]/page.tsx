import { FaArrowLeft } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import { Job } from "@/types/job";
import JobDetailCard from "@/app/components/JobDetailCard";

async function getStellenanzeige(id: string): Promise<Job> {
  const res = await fetch(`${getApiUrl()}/api/stellenanzeigen-aufgeben/${id}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Stellenanzeige konnte nicht geladen werden');
  }
  
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let stellenanzeige: Job | null = null;
  let error: string | null = null;

  try {
    stellenanzeige = await getStellenanzeige(resolvedParams.id);
  } catch (err) {
    error = "Stellenanzeige konnte nicht geladen werden";
    console.error(err);
  }

  if (error || !stellenanzeige) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || "Stellenanzeige nicht gefunden"}
        </div>
        <Link href="/" className="btn btn-secondary">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5" style={{maxWidth: '900px', margin: '0 auto'}}>
      <Link href="/" className="btn btn-outline-secondary mb-4">
        <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
        Zurück zur Übersicht
      </Link>

      <JobDetailCard job={stellenanzeige} />
    </div>
  );
}
