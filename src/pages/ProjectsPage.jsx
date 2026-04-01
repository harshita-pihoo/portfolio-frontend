import { useState, useEffect } from "react";
import api from "../services/api.js";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data);
      } catch (err) {
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-white text-5xl font-bold mb-4">Projects</h1>
          <div className="w-16 h-1 bg-indigo-500 rounded-full mb-6" />
          <p className="text-gray-400 text-lg max-w-2xl">
            A collection of things I have built — from full-stack web apps
            to machine learning projects.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading projects...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-32">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-32">
            <p className="text-gray-400 text-lg">No projects yet. Check back soon!</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:bg-white/8 transition-all duration-300 group flex flex-col"
              >
                {/* Thumbnail */}
                {project.thumbnailUrl ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 flex items-center justify-center">
                    <span className="text-5xl">💻</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-indigo-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack?.split(",").map((tech) => (
                      <span
                        key={tech}
                        className="bg-indigo-500/15 text-indigo-300 text-xs px-3 py-1 rounded-full border border-indigo-500/25"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 mt-auto">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2.5 rounded-lg transition-colors font-medium"
                      >
                        GitHub
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2.5 rounded-lg transition-colors font-medium"
                      >
                        Live Demo
                      </a>
                    )}
                    {!project.githubUrl && !project.demoUrl && (
                      <span className="text-gray-600 text-sm">No links available</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectsPage;
