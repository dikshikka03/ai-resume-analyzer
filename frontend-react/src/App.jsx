
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import jsPDF from "jspdf";
import { useState } from "react";
import "./App.css";

function App() {

  const [file, setFile] = useState(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] =
    useState(false);

  // ATS FORM STATES

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [linkedin, setLinkedin] =
    useState("");

  const [github, setGithub] =
    useState("");

  const [summary, setSummary] =
    useState("");

  const [college, setCollege] =
    useState("");

  const [degree, setDegree] =
    useState("");

  const [gpa, setGpa] =
    useState("");

  const [languages, setLanguages] =
    useState("");

  const [projects, setProjects] =
    useState("");

  const [certifications, setCertifications] =
    useState("");

  const [experience, setExperience] =
    useState("");

  // UPLOAD RESUME

  const uploadResume = async () => {

    try {

      if (!file) {

        alert("Please select a resume");

        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append("resume", file);

      formData.append(
        "jobDescription",
        jobDescription
      );

      const response = await fetch(
        "https://ai-resume-analyzer-p3l4.onrender.comm/uplaod",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {

        throw new Error(
          "Upload failed"
        );

      }

      const data =
        await response.json();

      setResult(data);

    }
    catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    }
    finally {

      setLoading(false);

    }

  };

  // DOWNLOAD ANALYSIS REPORT

  const downloadPDF = () => {

    if (!result) return;

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "AI Resume Analysis Report",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `ATS Score: ${result.atsScore}%`,
      20,
      40
    );

    doc.text(
      `Skills: ${result.skills?.join(", ")}`,
      20,
      60,
      { maxWidth: 170 }
    );

    doc.text(
      `Missing Skills: ${result.missingSkills?.join(", ")}`,
      20,
      90,
      { maxWidth: 170 }
    );

    doc.text(
      `Suggested Roles: ${result.suggestedRoles?.join(", ")}`,
      20,
      120,
      { maxWidth: 170 }
    );

    doc.text(
      `Feedback: ${result.feedback}`,
      20,
      150,
      { maxWidth: 170 }
    );

    doc.save(
      "resume-analysis.pdf"
    );

  };

  // GENERATE ATS RESUME PDF

  const generateATSResume = () => {

    const doc = new jsPDF();

    doc.setFontSize(24);

    doc.text(
      name || "Your Name",
      20,
      20
    );

    doc.setFontSize(11);

    doc.text(
      `Email: ${email}`,
      20,
      35
    );

    doc.text(
      `Phone: ${phone}`,
      20,
      42
    );

    doc.text(
      `LinkedIn: ${linkedin}`,
      20,
      49
    );

    doc.text(
      `GitHub: ${github}`,
      20,
      56
    );

    doc.line(20, 63, 190, 63);

    // SUMMARY

    doc.setFontSize(16);

    doc.text(
      "Professional Summary",
      20,
      80
    );

    doc.setFontSize(12);

    doc.text(
      summary,
      20,
      90,
      { maxWidth: 170 }
    );

    // SKILLS

    doc.setFontSize(16);

    doc.text(
      "Technical Skills",
      20,
      125
    );

    doc.setFontSize(12);

    doc.text(
      result?.skills?.join(", ") || "",
      20,
      135,
      { maxWidth: 170 }
    );

    // EDUCATION

    doc.setFontSize(16);

    doc.text(
      "Education",
      20,
      165
    );

    doc.setFontSize(12);

    doc.text(
      `${degree} - ${college}`,
      20,
      175
    );

    doc.text(
      `GPA/CGPA: ${gpa}`,
      20,
      183
    );

    // SECOND PAGE

    doc.addPage();

    doc.setFontSize(16);

    doc.text(
      "Projects",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      projects,
      20,
      30,
      { maxWidth: 170 }
    );

    doc.setFontSize(16);

    doc.text(
      "Languages Known",
      20,
      100
    );

    doc.setFontSize(12);

    doc.text(
      languages,
      20,
      110
    );

    doc.setFontSize(16);

    doc.text(
      "Certifications",
      20,
      140
    );

    doc.setFontSize(12);

    doc.text(
      certifications,
      20,
      150,
      { maxWidth: 170 }
    );

    doc.setFontSize(16);

    doc.text(
      "Experience",
      20,
      210
    );

    doc.setFontSize(12);

    doc.text(
      experience,
      20,
      220,
      { maxWidth: 170 }
    );

    doc.save(
      "ATS-Friendly-Resume.pdf"
    );

    setShowForm(false);

  };

  // CHART DATA

  const pieData = [

    {
      name: "Matched",
      value: result?.atsScore || 0
    },

    {
      name: "Remaining",
      value:
        100 -
        (result?.atsScore || 0)
    }

  ];

  const COLORS = [
    "#3B82F6",
    "#10B981"
  ];

  const skillData =
    result?.skills?.slice(0, 6).map(
      (skill, index) => ({

        skill,

        value: [
          90,
          85,
          80,
          75,
          95,
          88
        ][index]

      })
    ) || [];

  return (

    <div className="min-h-screen bg-[#020617] text-white p-8">

      <h1 className="text-5xl font-bold text-center mb-10">
        AI Resume Analyzer
      </h1>

      <div className="max-w-6xl mx-auto bg-[#0f172a] p-10 rounded-3xl shadow-lg">

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(
              e.target.files[0]
            )
          }
          className="mb-6"
        />

        <textarea
          placeholder="Paste Job Description"
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(
              e.target.value
            )
          }
          className="w-full h-64 p-4 rounded-2xl bg-[#1e293b] border border-gray-600 mb-6"
        />

        {/* BUTTONS */}

        <div className="flex flex-wrap gap-4 mt-8">

          <button
            onClick={uploadResume}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl text-base font-semibold"
          >

            {
              loading
                ? "Uploading..."
                : "Upload Resume"
            }

          </button>

          {

            result && (

              <button
                onClick={downloadPDF}
                className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-2xl text-base font-semibold"
              >
                Download Report PDF
              </button>

            )

          }

          {

            result && (

              <button
                onClick={() =>
                  setShowForm(true)
                }
                className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-2xl text-base font-semibold"
              >
                Generate ATS Resume
              </button>

            )

          }

        </div>

        {/* ATS MODAL */}

        {

          showForm && (

            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto p-4">

              <div className="bg-[#0f172a] p-8 rounded-3xl w-full max-w-3xl">

                <h2 className="text-3xl font-bold mb-6">
                  ATS Resume Details
                </h2>

                <div className="grid grid-cols-1 gap-4">

                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="p-4 rounded-xl bg-[#1e293b]" />

                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-4 rounded-xl bg-[#1e293b]" />

                  <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-4 rounded-xl bg-[#1e293b]" />

                  <input type="text" placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="p-4 rounded-xl bg-[#1e293b]" />

                  <input type="text" placeholder="GitHub URL" value={github} onChange={(e) => setGithub(e.target.value)} className="p-4 rounded-xl bg-[#1e293b]" />

                  <textarea placeholder="Professional Summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="p-4 rounded-xl bg-[#1e293b] h-28" />

                  <input type="text" placeholder="College Name" value={college} onChange={(e) => setCollege(e.target.value)} className="p-4 rounded-xl bg-[#1e293b]" />

                  <input type="text" placeholder="Degree" value={degree} onChange={(e) => setDegree(e.target.value)} className="p-4 rounded-xl bg-[#1e293b]" />

                  <input type="text" placeholder="GPA / CGPA" value={gpa} onChange={(e) => setGpa(e.target.value)} className="p-4 rounded-xl bg-[#1e293b]" />

                  <input type="text" placeholder="Languages Known" value={languages} onChange={(e) => setLanguages(e.target.value)} className="p-4 rounded-xl bg-[#1e293b]" />

                  <textarea placeholder="Projects" value={projects} onChange={(e) => setProjects(e.target.value)} className="p-4 rounded-xl bg-[#1e293b] h-28" />

                  <textarea placeholder="Certifications" value={certifications} onChange={(e) => setCertifications(e.target.value)} className="p-4 rounded-xl bg-[#1e293b] h-24" />

                  <textarea placeholder="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} className="p-4 rounded-xl bg-[#1e293b] h-24" />

                </div>

                <div className="flex gap-4 mt-6">

                  <button
                    onClick={generateATSResume}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-2xl font-semibold"
                  >
                    Generate Resume
                  </button>

                  <button
                    onClick={() =>
                      setShowForm(false)
                    }
                    className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-2xl font-semibold"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>

          )

        }

      </div>

    </div>

  );

}

export default App;
