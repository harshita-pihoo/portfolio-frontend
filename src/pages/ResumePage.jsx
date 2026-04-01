import { useState, useEffect } from "react";
import api from "../services/api.js";

const ResumePage = () => {
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get("/resume");
        setResumeUrl(response.data.url || "");
      } catch (err) {
        console.error("Failed to fetch resume URL");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const getPreviewUrl = (url) => {
    if (!url) return "";
    return url
      .replace("/view?usp=sharing", "/preview")
      .replace("/view?usp=drive_link", "/preview")
      .replace("/view", "/preview");
  };

  return (
    <div className="min-h-screen bg-black pt-24 px-6 pb-16">
      <div className="max-w-4xl mx-auto">

        <div className="mb-12">
          <h1 className="text-white text-5xl font-bold mb-4">Resume</h1>
          <div className="w-16 h-1 bg-indigo-500 rounded-full mb-6" />
          <p className="text-gray-400 text-lg">
            Download my latest resume or view it directly below.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : resumeUrl ? (
          <div className="flex flex-col gap-6">

            <div className="flex gap-4">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Download Resume
              </a>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Open in New Tab
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <iframe
                src={getPreviewUrl(resumeUrl)}
                className="w-full"
                style={{ height: "80vh" }}
                title="Resume"
                allow="autoplay"
              />
            </div>

          </div>
        ) : (
          <div className="text-center py-32 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-gray-400 text-lg mb-2">Resume not available yet.</p>
            <p className="text-gray-600 text-sm">Check back soon!</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResumePage;