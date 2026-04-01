import { useEffect, useState } from "react";
import api from "../services/api";

const ResumePage = () => {
  const [resumeUrl, setResumeUrl] = useState("");

  // 🔥 Convert Google Drive link automatically
  const convertDriveLink = (url) => {
    if (!url) return "";

    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.*?)(\/|$)/);
      const fileId = match ? match[1] : null;

      if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }

    return url;
  };

  useEffect(() => {
    api.get("/api/resume")
      .then((res) => {
        const fixedUrl = convertDriveLink(res.data.url);
        setResumeUrl(fixedUrl);
      })
      .catch(() => {
        console.log("No resume found");
      });
  }, []);

  if (!resumeUrl) {
    return (
      <div className="text-white text-center mt-32">
        No resume uploaded yet
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-white text-3xl font-bold mb-6 text-center">
          My Resume
        </h1>

        {/* Resume Viewer */}
        <iframe
          src={resumeUrl}
          title="Resume"
          className="w-full h-[600px] rounded-lg border border-white/10"
        />

        {/* Download Button */}
        <div className="text-center mt-6">
          <a
            href={resumeUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ⬇ Download Resume
          </a>
        </div>

      </div>
    </div>
  );
};

export default ResumePage;