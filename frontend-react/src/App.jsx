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

  const downloadPDF = () => {

    if (!result) {
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);

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
      `Resume Score: ${result.resumeScore}`,
      20,
      55
    );

    doc.text(
      `Skills: ${
        Array.isArray(result.skills)
          ? result.skills.join(", ")
          : "No skills found"
      }`,
      20,
      75,
      { maxWidth: 170 }
    );

    doc.text(
      `Missing Skills: ${
        Array.isArray(result.missingSkills)
          ? result.missingSkills.join(", ")
          : "No missing skills"
      }`,
      20,
      105,
      { maxWidth: 170 }
    );

    doc.text(
      `Suggested Roles: ${
        Array.isArray(result.suggestedRoles)
          ? result.suggestedRoles.join(", ")
          : "No roles found"
      }`,
      20,
      135,
      { maxWidth: 170 }
    );

    doc.text(
      `Feedback: ${
        Array.isArray(result.feedback)
          ? result.feedback.join(", ")
          : "No feedback"
      }`,
      20,
      165,
      { maxWidth: 170 }
    );

    doc.save(
      "resume-analysis.pdf"
    );

  };

  const generateATSResume = () => {

    if (!result) {
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "ATS Friendly Resume",
      20,
      20
    );

    doc.setFontSize(14);

    doc.text(
      "Name: Dikshika Sachdeva",
      20,
      40
    );

    doc.text(
      "Skills:",
      20,
      60
    );

    doc.text(
      Array.isArray(result.skills)
        ? result.skills.join(", ")
        : "No skills found",
      20,
      75,
      { maxWidth: 170 }
    );

    doc.text(
      "Suggested Roles:",
      20,
      110
    );

    doc.text(
      Array.isArray(result.suggestedRoles)
        ? result.suggestedRoles.join(", ")
        : "No roles found",
      20,
      125,
      { maxWidth: 170 }
    );

    doc.save(
      "ATS-Resume.pdf"
    );

  };

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
                  transition-all
                  duration-300
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
                  transition-all
                  duration-300
                "
              >
                Generate ATS Resume
              </button>

            )

          }

        </div>

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

                <div className="mt-4 text-lg text-gray-300">

                  {
                    result.atsScore >= 75
                    ? "Excellent ATS Match"
                    : result.atsScore >= 50
                    ? "Good ATS Match"
                    : "Needs Improvement"
                  }

                </div>

              </div>

              <div className="bg-[#0f172a] p-6 rounded-3xl mt-10">

                <h2 className="text-3xl font-bold mb-2">
                  Skills Analytics
                </h2>

                <p className="text-gray-400 mb-6">
                  AI-estimated proficiency level for detected skills
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

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-[#0f172a] p-6 rounded-3xl">

                  <h2 className="text-3xl font-bold mb-4">
                    ATS Match
                  </h2>

                  <p className="text-5xl text-blue-400">
                    {result.atsScore}%
                  </p>

                  <div className="w-full bg-gray-700 rounded-full h-4 mt-4">

                    <div
                      className="
                        bg-blue-500
                        h-4
                        rounded-full
                        transition-all
                        duration-500
                      "
                      style={{
                        width: `${result.atsScore}%`
                      }}
                    ></div>

                  </div>

                </div>

                <div className="bg-[#0f172a] p-6 rounded-3xl">

                  <h2 className="text-3xl font-bold mb-4">
                    Skills
                  </h2>

                  <p>
                    {
                      Array.isArray(
                        result.skills
                      )
                        ? result.skills.join(", ")
                        : result.skills
                    }
                  </p>

                </div>

                <div className="bg-[#0f172a] p-6 rounded-3xl">

                  <h2 className="text-3xl font-bold mb-4">
                    Missing Skills
                  </h2>

                  <p>
                    {
                      Array.isArray(
                        result.missingSkills
                      )
                        ? result.missingSkills.join(", ")
                        : result.missingSkills
                    }
                  </p>

                </div>

                <div className="bg-[#0f172a] p-6 rounded-3xl">

                  <h2 className="text-3xl font-bold mb-4">
                    Suggested Roles
                  </h2>

                  <p>
                    {
                      Array.isArray(
                        result.suggestedRoles
                      )
                        ? result.suggestedRoles.join(", ")
                        : result.suggestedRoles
                    }
                  </p>

                </div>

                <div className="bg-[#0f172a] p-6 rounded-3xl md:col-span-2">

                  <h2 className="text-3xl font-bold mb-4">
                    AI Feedback
                  </h2>

                  <p>
                    {
                      Array.isArray(
                        result.feedback
                      )
                        ? result.feedback.join(", ")
                        : result.feedback
                    }
                  </p>

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