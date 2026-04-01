import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeInputUrl, setResumeInputUrl] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  const emptyForm = {
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    demoUrl: '',
    thumbnailUrl: '',
  };

  const [form, setForm] = useState(emptyForm);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      showMessage('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch current resume URL
  const fetchResumeUrl = async () => {
    try {
      const response = await api.get('/resume');
      setResumeUrl(response.data.url || '');
      setResumeInputUrl(response.data.url || '');
    } catch (err) {
      // No resume yet — that's fine
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchResumeUrl();
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update project
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, form);
        showMessage('Project updated successfully!', 'success');
      } else {
        await api.post('/projects', form);
        showMessage('Project added successfully!', 'success');
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      showMessage('Something went wrong. Please try again.', 'error');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title || '',
      description: project.description || '',
      techStack: project.techStack || '',
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      thumbnailUrl: project.thumbnailUrl || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      showMessage('Project deleted!', 'success');
      fetchProjects();
    } catch (err) {
      showMessage('Failed to delete project.', 'error');
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingProject(null);
    setShowForm(false);
  };

  // Update resume via URL link
  const handleResumeUrlUpdate = async (e) => {
    e.preventDefault();
    setResumeLoading(true);
    try {
      await api.post('/resume/url', { url: resumeInputUrl });
      setResumeUrl(resumeInputUrl);
      showMessage('Resume URL updated successfully!', 'success');
    } catch (err) {
      showMessage('Failed to update resume URL.', 'error');
    } finally {
      setResumeLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-black pt-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your portfolio content</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Toast message */}
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-semibold text-sm transition-colors ${
              activeTab === 'projects'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-6 py-3 font-semibold text-sm transition-colors ${
              activeTab === 'resume'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Resume
          </button>
        </div>

        {/* ===== PROJECTS TAB ===== */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">
                Projects ({projects.length})
              </h2>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingProject(null);
                  setForm(emptyForm);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {showForm ? 'Cancel' : '+ Add Project'}
              </button>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                <h3 className="text-white text-lg font-bold mb-6">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="md:col-span-2">
                    <label className="text-gray-400 text-sm mb-1 block">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Sign Language Detector"
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-400 text-sm mb-1 block">Description *</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Describe what this project does..."
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-indigo-500 outline-none resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-400 text-sm mb-1 block">Tech Stack *</label>
                    <input
                      type="text"
                      name="techStack"
                      value={form.techStack}
                      onChange={handleChange}
                      required
                      placeholder="e.g. React, Spring Boot, MySQL (comma separated)"
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">GitHub URL</label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={form.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Live Demo URL</label>
                    <input
                      type="url"
                      name="demoUrl"
                      value={form.demoUrl}
                      onChange={handleChange}
                      placeholder="https://your-demo.vercel.app"
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-400 text-sm mb-1 block">Thumbnail URL (optional)</label>
                    <input
                      type="url"
                      name="thumbnailUrl"
                      value={form.thumbnailUrl}
                      onChange={handleChange}
                      placeholder="https://link-to-screenshot.png"
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-3 mt-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      {editingProject ? 'Update Project' : 'Add Project'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* Projects List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="text-gray-400 text-lg">Loading projects...</div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-400 text-lg">No projects yet.</p>
                <p className="text-gray-600 text-sm mt-2">Click "+ Add Project" to get started.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 flex justify-between items-start gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-1">{project.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.techStack?.split(',').map((tech) => (
                          <span
                            key={tech}
                            className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-500/30"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-sm">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">
                            GitHub ↗
                          </a>
                        )}
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300">
                            Live Demo ↗
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(project)}
                        className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

 
        {/* ===== RESUME TAB ===== */}
        {activeTab === 'resume' && (
          <div className="max-w-2xl">
            <h2 className="text-white text-xl font-bold mb-6">Resume Management</h2>

            {resumeUrl && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Current resume</p>
                  <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm underline">
                    View current resume
                  </a>
                </div>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                  Active
                </span>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <h3 className="text-white font-bold mb-2">Update Resume via URL</h3>
              <p className="text-gray-500 text-sm mb-4">
                Upload your resume to Google Drive and paste the direct link here.
              </p>
              <form onSubmit={handleResumeUrlUpdate} className="flex flex-col gap-4">
                <input
                  type="url"
                  value={resumeInputUrl}
                  onChange={(e) => setResumeInputUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/your-resume-link"
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-indigo-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={resumeLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-fit"
                >
                  {resumeLoading ? 'Updating...' : 'Update Resume URL'}
                </button>
              </form>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <p className="text-amber-400 text-sm font-medium mb-1">How to get a Google Drive link:</p>
              <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
                <li>Upload your resume PDF to Google Drive</li>
                <li>Right click, Share, change to Anyone with link</li>
                <li>Copy the link and paste it above</li>
              </ol>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;