import { useState } from "react";

const AdminDashboard = () => {
  const [file, setFile] = useState(null);

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await fetch("https://portfolio-0o4v.onrender.com/resume", {
      method: "POST",
      body: formData,
    });

    alert("Resume updated!");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Resume Upload Section */}
      <div>
        <h2>Update Resume</h2>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={uploadResume}>
          Upload Resume
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;