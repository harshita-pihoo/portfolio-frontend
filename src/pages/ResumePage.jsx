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
        return `https://drive.google.com/file/d/${fileId}/preview`;
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

  return (
    <div className="bg-black text-white min-h-screen">

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-10">

        <h1 className="text-3xl font-bold text-center mb-8">
          My Resume
        </h1>

        {!resumeUrl ? (
          <p className="text-center text-gray-400">
            No resume uploaded yet
          </p>
        ) : (
          <>
            {/* 🔥 PDF Viewer */}
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
                src={resumeUrl}
                title="Resume"
                className="w-full h-[600px]"
              />
            </div>

            {/* 🔥 Download Button */}
            <div className="text-center mt-6">
              <a
                href={resumeUrl.replace("/preview", "/view")}
                target="_blank"
                rel="noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold"
              >
                ⬇ Download Resume
              </a>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ResumePage;