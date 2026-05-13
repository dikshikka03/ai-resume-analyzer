require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdf = require("pdf-parse");

const app = express();

app.use(cors());

const skillsList = [
  "Java",
  "Python",
  "C++",
  "SQL",
  "React",
  "Node.js",
  "MongoDB",
  "Machine Learning",
  "HTML",
  "CSS",
  "JavaScript",
  "Git",
  "Pandas",
  "NumPy",
  "Scikit-learn"
];

const requiredSkills = [
  "Java",
  "Python",
  "React",
  "Node.js",
  "MongoDB",
  "SQL",
  "Git"
];

function extractSkills(text) {

  let foundSkills = [];

  skillsList.forEach(skill => {

    if (
      text.toLowerCase().includes(
        skill.toLowerCase()
      )
    ) {
      foundSkills.push(skill);
    }

  });

  return foundSkills;
}

function calculateScore(skills) {

  let score = skills.length * 10;

  if (score > 100) {
    score = 100;
  }

  return score;
}

function findMissingSkills(foundSkills) {

  let missing = [];

  requiredSkills.forEach(skill => {

    if (!foundSkills.includes(skill)) {
      missing.push(skill);
    }

  });

  return missing;
}

function suggestJobRoles(skills) {

  let roles = [];

  if (
    skills.includes("Python") &&
    skills.includes("Machine Learning")
  ) {
    roles.push("AI/ML Engineer");
  }

  if (
    skills.includes("JavaScript") &&
    skills.includes("React")
  ) {
    roles.push("Frontend Developer");
  }

  if (
    skills.includes("Node.js") &&
    skills.includes("MongoDB")
  ) {
    roles.push("Backend Developer");
  }

  if (
    skills.includes("SQL") &&
    skills.includes("Pandas")
  ) {
    roles.push("Data Analyst");
  }

  return roles;
}

function generateFeedback(
  score,
  missingSkills
) {

  let feedback = [];

  if (score >= 80) {
    feedback.push(
      "Strong resume overall."
    );
  }
  else {
    feedback.push(
      "Resume needs improvement."
    );
  }

  if (missingSkills.length > 0) {

    feedback.push(
      "Consider learning: " +
      missingSkills.join(", ")
    );

  }

  return feedback;
}

function calculateATSScore(
  skills,
  jobDescription
) {

  let matchCount = 0;

  skills.forEach(skill => {

    if (
      jobDescription
        .toLowerCase()
        .includes(skill.toLowerCase())
    ) {
      matchCount++;
    }

  });

  if (skills.length === 0) {
    return 0;
  }

  return Math.round(
    (matchCount / skills.length) * 100
  );
}

const upload = multer({
  storage: multer.memoryStorage()
});

app.get("/", (req, res) => {

  res.send(
    "Backend running successfully"
  );

});

app.post(
  "/upload",
  upload.single("resume"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });

      }

      const data =
        await pdf(req.file.buffer);

      const skills =
        extractSkills(data.text);

      const score =
        calculateScore(skills);

      const missingSkills =
        findMissingSkills(skills);

      const suggestedRoles =
        suggestJobRoles(skills);

      const feedback =
        generateFeedback(
          score,
          missingSkills
        );

      const atsScore =
        calculateATSScore(
          skills,
          req.body.jobDescription || ""
        );

      res.json({

        success: true,

        extractedText: data.text,

        skills: skills,

        resumeScore: score,

        atsScore: atsScore,

        missingSkills: missingSkills,

        suggestedRoles: suggestedRoles,

        feedback: feedback

      });

    }
    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message: error.message

      });

    }

  }
);

app.listen(5000, () => {

  console.log(
    "Server started on port 5000"
  );

});
