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

  const [file, setFile] =
    useState(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  // ATS FORM STATES

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [linkedin, setLinkedin] =
    useState("");

  const [github, setGithub] =
    useState("");

  const [projects, setProjects] =
    useState("");

  const [experience, setExperience] =
    useState("");

  const [languages, setLanguages] =
    useState("");

  const [education, setEducation] =
    useState("");

  const [certifications, setCertifications] =
    useState("");

  const [skillsInput, setSkillsInput] =
    useState("");

  // UPLOAD RESUME

  const uploadResume = async () => {

    try {

      if (!file) {

        alert(
          "Please select resume"
        );

        return;
      }

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "resume",
        file
      );

      formData.append(
        "jobDescription",
        jobDescription
      );

      const response =
        await fetch(
          "https://ai-resume-analyzer-p3l4.onrender.com/upload",
          {
            method: "POST",
            body: formData,
          }
        );

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

  // TRENDING TECH SKILLS

  const trendingSkills = [

    "react",
    "node.js",
    "next.js",
    "typescript",
    "mongodb",
    "express",
    "python",
    "java",
    "c++",
    "sql",
    "machine learning",
    "ai",
    "aws",
    "docker",
    "kubernetes",
    "git",
    "javascript"

  ];

  // USER SKILLS

  const userSkills =

    result?.skills?.map(
      (skill) =>
        skill.toLowerCase()
    ) || [];

  // MATCHED SKILLS

  const matchedSkills =

    trendingSkills.filter(
      (skill) =>

        userSkills.some(
          (userSkill) =>

            userSkill.includes(skill)
        )
    );

  // MISSING SKILLS

  const missingSkills =

    trendingSkills.filter(
      (skill) =>

        !matchedSkills.includes(skill)
    );

  // REALISTIC ATS SCORE

  const atsScore =

    Math.min(

      Math.round(
        (
          matchedSkills.length /
          trendingSkills.length
        ) * 100
      ),

      95

    );

  // ATS MESSAGE

  const atsMessage =

    atsScore >= 80

      ? "Excellent ATS compatibility"

      : atsScore >= 60

      ? "Good profile but needs improvement"

      : atsScore >= 40

      ? "Average ATS match"

      : "Low ATS match. Add more relevant skills";

  // PIE DATA

  const pieData = [

    {
      name: "Matched",
      value: atsScore
    },

    {
      name: "Missing",
      value:
        100 - atsScore
    }

  ];

  // SKILL ANALYTICS

  const topSkills =

    matchedSkills.slice(0, 6);

  const skillData =

    topSkills.map(
      (skill) => ({

        skill,

        value:

          Math.floor(
            Math.random() * 20
          ) + 75

      })
    );

  // DOWNLOAD REPORT PDF

  const downloadPDF = () => {

    if (!result) return;

    const doc =
      new jsPDF();

    doc.setFontSize(24);

    doc.text(
      "AI Resume Analysis Report",
      20,
      20
    );

    doc.setFontSize(14);

    doc.text(
      `ATS Score: ${atsScore}%`,
      20,
      45
    );

    doc.text(
      `Matched Skills: ${matchedSkills.join(", ")}`,
      20,
      65,
      {
        maxWidth: 170
      }
    );

    doc.text(
      `Missing Skills: ${missingSkills.join(", ")}`,
      20,
      95,
      {
        maxWidth: 170
      }
    );

    doc.text(
      `Feedback: ${atsMessage}`,
      20,
      125,
      {
        maxWidth: 170
      }
    );

    doc.save(
      "resume-analysis.pdf"
    );

  };

  // GENERATE ATS RESUME

  const generateATSResume = () => {

    const doc =
      new jsPDF();

    doc.setFontSize(28);

    doc.text(
      name,
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      email,
      20,
      34
    );

    doc.text(
      phone,
      20,
      42
    );

    doc.text(
      linkedin,
      20,
      50
    );

    doc.text(
      github,
      20,
      58
    );

    doc.line(
      20,
      66,
      190,
      66
    );

    // EDUCATION

    doc.setFontSize(18);

    doc.text(
      "Education",
      20,
      82
    );

    doc.setFontSize(12);

    doc.text(
      education,
      20,
      94,
      {
        maxWidth: 170
      }
    );

    // SKILLS

    doc.setFontSize(18);

    doc.text(
      "Skills",
      20,
      125
    );

    doc.setFontSize(12);

    doc.text(
      skillsInput,
      20,
      137,
      {
        maxWidth: 170
      }
    );

    // PROJECTS

    doc.setFontSize(18);

    doc.text(
      "Projects",
      20,
      167
    );

    doc.setFontSize(12);

    doc.text(
      projects,
      20,
      179,
      {
        maxWidth: 170
      }
    );

    doc.addPage();

    // EXPERIENCE

    doc.setFontSize(18);

    doc.text(
      "Experience",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      experience,
      20,
      32,
      {
        maxWidth: 170
      }
    );

    // LANGUAGES

    doc.setFontSize(18);

    doc.text(
      "Languages Known",
      20,
      120
    );

    doc.setFontSize(12);

    doc.text(
      languages,
      20,
      132
    );

    // CERTIFICATIONS

    doc.setFontSize(18);

    doc.text(
      "Certifications",
      20,
      165
    );

    doc.setFontSize(12);

    doc.text(
      certifications,
      20,
      177,
      {
        maxWidth: 170
      }
    );

    doc.save(
      "ATS-Resume.pdf"
    );

    setShowForm(false);

  };

  return (

    <div className="min-h-screen bg-[#020617] text-white p-6">

      <h1 className="text-6xl font-bold text-center mb-10">
        AI Resume Analyzer
      </h1>

      <div className="max-w-7xl mx-auto bg-[#0f172a] p-8 rounded-3xl">

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
          className="w-full h-60 p-5 rounded-2xl bg-[#1e293b] mb-6"
        />

        {/* BUTTONS */}

        <div className="flex flex-wrap items-center gap-4 mb-10">

          <button
            onClick={uploadResume}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-semibold"
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
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl font-semibold"
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
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-2xl font-semibold"
              >
                Generate ATS Resume
              </button>

            )

          }

        </div>

        {

          result && (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* LEFT */}

              <div className="space-y-6">

                {/* ATS MATCH */}

                <div className="bg-[#1e293b] p-6 rounded-3xl">

                  <h2 className="text-4xl font-bold mb-4">
                    ATS Match
                  </h2>

                  <p className="text-6xl text-blue-400 font-bold">
                    {atsScore}%
                  </p>

                  <p className="mt-4 text-gray-300">
                    {atsMessage}
                  </p>

                </div>

                {/* SKILLS */}

                <div className="bg-[#1e293b] p-6 rounded-3xl">

                  <h2 className="text-4xl font-bold mb-4">
                    Skills
                  </h2>

                  <p className="text-lg leading-9">

                    {

                      matchedSkills.length > 0

                        ? matchedSkills.join(", ")

                        : "No matching skills found"

                    }

                  </p>

                </div>

                {/* MISSING SKILLS */}

                <div className="bg-[#1e293b] p-6 rounded-3xl">

                  <h2 className="text-4xl font-bold mb-4">
                    Missing Skills
                  </h2>

                  <p className="text-lg leading-9">

                    {

                      missingSkills.length > 0

                        ? missingSkills
                            .slice(0, 8)
                            .join(", ")

                        : "No major missing skills"

                    }

                  </p>

                </div>

                {/* SUGGESTED ROLES */}

                <div className="bg-[#1e293b] p-6 rounded-3xl">

                  <h2 className="text-4xl font-bold mb-4">
                    Suggested Roles
                  </h2>

                  <p className="text-lg leading-9">

                    {

                      matchedSkills.includes("machine learning")

                        ? "AI/ML Engineer, Data Scientist"

                        : matchedSkills.includes("react")

                        ? "Frontend Developer, MERN Stack Developer"

                        : matchedSkills.includes("java")

                        ? "Java Developer, Backend Developer"

                        : matchedSkills.includes("python")

                        ? "Python Developer, Data Analyst"

                        : "Software Developer"

                    }

                  </p>

                </div>

                {/* AI FEEDBACK */}

                <div className="bg-[#1e293b] p-6 rounded-3xl">

                  <h2 className="text-4xl font-bold mb-4">
                    AI Feedback
                  </h2>

                  <p className="text-lg leading-9">

                    {

                      atsScore >= 80

                        ? "Excellent resume. Strong ATS compatibility and good technical skills."

                        : atsScore >= 60

                        ? "Good resume but adding more trending technologies can improve ATS score."

                        : atsScore >= 40

                        ? "Resume needs improvements. Add more relevant projects and trending skills."

                        : "Low ATS score. Improve resume structure, projects, and technical stack."

                    }

                  </p>

                </div>

              </div>

              {/* RIGHT */}

              <div className="space-y-6">

                {/* ATS ANALYTICS */}

                <div className="bg-[#1e293b] p-6 rounded-3xl">

                  <h2 className="text-4xl font-bold text-center mb-4">
                    ATS Analytics
                  </h2>

                  <div className="flex justify-center">

                    <PieChart
                      width={320}
                      height={320}
                    >

                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        dataKey="value"
                      >

                        {

                          pieData.map(
                            (
                              entry,
                              index
                            ) => (

                              <Cell
                                key={index}
                                fill={
                                  index === 0
                                    ? "#3B82F6"
                                    : "#EF4444"
                                }
                              />

                            )
                          )

                        }

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </div>

                  <div className="text-center mt-4">

                    <p className="text-3xl font-bold text-blue-400">
                      {atsScore}% Match
                    </p>

                    <p className="text-gray-400 mt-2">
                      {
                        matchedSkills.length
                      } skills matched
                    </p>

                  </div>

                </div>

                {/* SKILL ANALYTICS */}

                <div className="bg-[#1e293b] p-6 rounded-3xl">

                  <h2 className="text-4xl font-bold mb-6">
                    Skills Analytics
                  </h2>

                  <div
                    style={{
                      width: "100%",
                      height: 380
                    }}
                  >

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={skillData}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                        />

                        <XAxis
                          dataKey="skill"
                        />

                        <YAxis />

                        <Tooltip />

                        <Bar
                          dataKey="value"
                          fill="#3B82F6"
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                </div>

              </div>

            </div>

          )

        }

      </div>

      {/* ATS MODAL */}

      {

        showForm && (

          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto p-4">

            <div className="bg-[#0f172a] p-8 rounded-3xl w-full max-w-3xl">

              <h2 className="text-4xl font-bold mb-6">
                ATS Resume Details
              </h2>

              <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b]"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b]"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b]"
                />

                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={linkedin}
                  onChange={(e) =>
                    setLinkedin(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b]"
                />

                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={github}
                  onChange={(e) =>
                    setGithub(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b]"
                />

                <textarea
                  placeholder="Projects"
                  value={projects}
                  onChange={(e) =>
                    setProjects(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b] h-24"
                />

                <textarea
                  placeholder="Experience"
                  value={experience}
                  onChange={(e) =>
                    setExperience(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b] h-24"
                />

                <input
                  type="text"
                  placeholder="Languages Known"
                  value={languages}
                  onChange={(e) =>
                    setLanguages(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b]"
                />

                <textarea
                  placeholder="Education"
                  value={education}
                  onChange={(e) =>
                    setEducation(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b] h-20"
                />

                <textarea
                  placeholder="Certifications"
                  value={certifications}
                  onChange={(e) =>
                    setCertifications(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b] h-20"
                />

                <input
                  type="text"
                  placeholder="Skills"
                  value={skillsInput}
                  onChange={(e) =>
                    setSkillsInput(e.target.value)
                  }
                  className="p-4 rounded-xl bg-[#1e293b]"
                />

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

  );

}

export default App;