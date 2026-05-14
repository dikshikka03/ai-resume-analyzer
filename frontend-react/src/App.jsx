import { useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

function App() {

  const [file, setFile] = useState(null);

  const [result, setResult] = useState(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const COLORS = [
    "#3B82F6",
    "#10B981"
  ];

  const uploadResume = async () => {

    if (!file) {

      alert("Please select a resume");

      return;
    }

    setLoading(true);

    setError("");

    const formData = new FormData();

    formData.append("resume", file);

    formData.append(
      "jobDescription",
      jobDescription
    );

    try {

      const response = await fetch(
        "http://ai-resume-analyzer-production-557e.up.railway.app/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      console.log(data);

      setResult(data);

    }
    catch (err) {

      setError("Something went wrong");

    }
    finally {

      setLoading(false);

    }

  };

  const chartData = [

    {
      name: "Matched",
      value: result?.atsScore || 0
    },

    {
      name: "Remaining",
      value: 100 - (result?.atsScore || 0)
    }

  ];

  return (

    <div className="min-h-screen bg-gray-950 text-white p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-center mb-10">
          AI Resume Analyzer
        </h1>

        <div className="bg-gray-900 p-8 rounded-2xl">

          <input
            type="file"
            className="mb-6"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          <textarea
            rows="8"
            placeholder="Paste Job Description"
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            className="
              w-full
              p-4
              rounded-xl
              bg-gray-800
              border
              border-gray-700
              mb-6
            "
          />

          <button
            onClick={uploadResume}
            disabled={loading}
            className="
              bg-blue-600
              hover:bg-blue-700
              px-6
              py-3
              rounded-xl
              font-semibold
            "
          >

            {
              loading ? (

                <div className="flex items-center gap-2">

                  <div
                    className="
                      w-5
                      h-5
                      border-2
                      border-white
                      border-t-transparent
                      rounded-full
                      animate-spin
                    "
                  ></div>

                  <span>
                    Analyzing...
                  </span>

                </div>

              ) : (

                "Upload Resume"

              )
            }

          </button>

          {

            error && (

              <p className="text-red-400 mt-4">
                {error}
              </p>

            )

          }

        </div>

        {

          result && (

            <div className="grid md:grid-cols-2 gap-6 mt-10">

              <div className="bg-gray-900 p-6 rounded-2xl">

                <h2 className="text-2xl font-bold mb-4">
                  ATS Match
                </h2>

                <PieChart width={250} height={250}>

                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                  >

                    {
                      chartData.map(
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

                </PieChart>

                <p className="text-3xl text-center text-blue-400">
                  {result.atsScore}%
                </p>

              </div>

              <div className="bg-gray-900 p-6 rounded-2xl">

                <h2 className="text-2xl font-bold">
                  Resume Score
                </h2>

                <p className="text-4xl text-green-400">
                  {result.resumeScore}
                </p>

              </div>

              <div className="bg-gray-900 p-6 rounded-2xl">

                <h2 className="text-2xl font-bold">
                  Skills
                </h2>

                <p>
                  {result.skills?.join(", ")}
                </p>

              </div>

              <div className="bg-gray-900 p-6 rounded-2xl">

                <h2 className="text-2xl font-bold">
                  Missing Skills
                </h2>

                <p>
                  {result.missingSkills?.join(", ")}
                </p>

              </div>

              <div className="bg-gray-900 p-6 rounded-2xl">

                <h2 className="text-2xl font-bold">
                  Suggested Roles
                </h2>

                <p>
                  {result.suggestedRoles?.join(", ")}
                </p>

              </div>

              <div className="bg-gray-900 p-6 rounded-2xl">

                <h2 className="text-2xl font-bold">
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

          )

        }

      </div>

    </div>

  );

}

export default App;