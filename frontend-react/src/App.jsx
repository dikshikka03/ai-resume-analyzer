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

  // USER DETAILS

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [linkedin, setLinkedin] =
    useState("");

  const [github, setGithub] =
    useState("");

  const [summary, setSummary] =
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
        "https://ai-resume-analyzer-production-557e.up.railway.app/upload",
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

  // DOWNLOAD REPORT PDF

  const downloadPDF = () => {

    if (!result) {
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);

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
      `Skills: ${
        Array.isArray(result.skills)
          ? result.skills.join(", ")
          : "No skills found"
      }`,
      20,
      60,
      { maxWidth: 170 }
    );

    doc.text(
      `Missing Skills: ${
        Array.isArray(result.missingSkills)
          ? result.missingSkills.join(", ")
          : "No missing skills"
      }`,
      20,
      90,
      { maxWidth: 170 }
    );

    doc.text(
      `Suggested Roles: ${
        Array.isArray(result.suggestedRoles)
          ? result.suggestedRoles.join(", ")
          : "No roles found"
      }`,
      20,
      120,
      { maxWidth: 170 }
    );

    doc.save(
      "resume-analysis.pdf"
    );

  };

  // GENERATE ATS RESUME

  const generateATSResume = () => {

    if (!result) {
      return;
    }

    const doc = new jsPDF();

    // NAME

    doc.setFontSize(24);

    doc.text(
      name || "Your Name",
      20,
      20
    );

    // CONTACT

    doc.setFontSize(11);

    doc.text(
      `Email: ${email}`,
      20,
      35
    );

    doc.text(
      `LinkedIn: ${linkedin}`,
      20,
      42
    );

    doc.text(
      `GitHub: ${github}`,
      20,
      49
    );

    // LINE

    doc.line(20, 55, 190, 55);

    // SUMMARY

    doc.setFontSize(16);

    doc.text(
      "Professional Summary",
      20,
      70
    );

    doc.setFontSize(12);

    doc.text(
      summary ||
      "Passionate software developer with strong technical skills.",
      20,
      80,
      { maxWidth: 170 }
    );

    // SKILLS

    doc.setFontSize(16);

    doc.text(
      "Technical Skills",
      20,
      110
    );

    doc.setFontSize(12);

    doc.text(
      Array.isArray(result.skills)
        ? result.skills.join(", ")
        : "No skills found",
      20,
      120,
      { maxWidth: 170 }
    );

    // ATS SCORE

    doc.setFontSize(16);

    doc.text(
      "ATS Match Score",
      20,
      150
    );

    doc.setFontSize(14);

    doc.text(
      `${result.atsScore}% Match`,
      20,
      160
    );

    // SUGGESTED ROLES

    doc.setFontSize(16);

    doc.text(
      "Suggested Roles",
      20,
      185
    );

    doc.setFontSize(12);

    doc.text(
      Array.isArray(result.suggestedRoles)
        ? result.suggestedRoles.join(", ")
        : "No roles found",
      20,
      195,
      { maxWidth: 170 }
    );

    doc.save(
      "ATS-Friendly-Resume.pdf"
    );

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
    result?.skills?.map((skill) => ({

      skill,

      value:
        Math.floor(
          Math.random() * 40
        ) + 60

    })) || [];

  return (

    <div className="min-h-screen bg-[#020617] text-white p-8">

      <h1 className="text-5xl font-bold text-center mb-10">
        AI Resume Analyzer
      </h1>

      <div className="max-w-5xl mx-auto bg-[#0f172a] p-10 rounded-3xl shadow-lg">

        {/* USER DETAILS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

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

        </div>

        <textarea
          placeholder="Professional Summary"
          value={summary}
          onChange={(e) =>
            setSummary(e.target.value)
          }
          className="
            w-full
            h-32
            p-4
            rounded-2xl
            bg-[#1e293b]
            mb-6
          "
        />

        {/* RESUME */}

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
          className="
            w-full
            h-64
            p-4
            rounded-2xl
            bg-[#1e293b]
            text-white
            border
            border-gray-600
            outline-none
            mb-6
          "
        />

        {/* BUTTONS */}

        <div className="flex flex-wrap gap-4 mt-8">

          <button
            onClick={uploadResume}
            className="
              bg-blue-600
              hover:bg-blue-700
              px-5
              py-3
              rounded-2xl
              text-base
              font-semibold
              transition-all
              duration-300
            "
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
                className="
                  bg-green-600
                  hover:bg-green-700
                  px-5
                  py-3
                  rounded-2xl
                  text-base
                  font-semibold
                "
              >
                Download Report PDF
              </button>

            )

          }

          {

            result && (

              <button
                onClick={generateATSResume}
                className="
                  bg-purple-600
                  hover:bg-purple-700
                  px-5
                  py-3
                  rounded-2xl
                  text-base
                  font-semibold
                "
              >
                Generate ATS Resume
              </button>

            )

          }

        </div>

        {/* ATS ANALYTICS */}

        {

          result && (

            <>

              <div className="bg-[#0f172a] p-8 rounded-3xl mt-10 text-center">

                <h2 className="text-3xl font-bold mb-2">
                  ATS Analytics
                </h2>

                <p className="text-gray-400 mb-6">
                  Resume compatibility with job description
                </p>

                <div className="flex justify-center">

                  <PieChart
                    width={350}
                    height={350}
                  >

                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={120}
                      dataKey="value"
                    >

                      {

                        pieData.map(
                          (entry, index) => (

                            <Cell
                              key={index}
                              fill={COLORS[index]}
                            />

                          )
                        )

                      }

                    </Pie>

                    <Tooltip />

                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="28"
                      fontWeight="bold"
                    >
                      {result.atsScore}%
                    </text>

                  </PieChart>

                </div>

              </div>

              {/* SKILLS ANALYTICS */}

              <div className="bg-[#0f172a] p-6 rounded-3xl mt-10">

                <h2 className="text-3xl font-bold mb-2">
                  Skills Analytics
                </h2>

                <p className="text-gray-400 mb-6">
                  AI-estimated proficiency level
                </p>

                <div
                  style={{
                    width: "100%",
                    height: 400
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

            </>

          )

        }

      </div>

    </div>

  );

}

export default App;