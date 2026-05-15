require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();

const PORT =
  process.env.PORT || 5000;

// CORS

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

// JSON LIMIT

app.use(
  express.json({
    limit: "10mb",
  })
);

// MULTER STORAGE

const upload = multer({
  dest: "uploads/",
});

// HOME ROUTE

app.get("/", (req, res) => {

  res.send(
    "AI Resume Analyzer Backend Running"
  );

});

// UPLOAD ROUTE

app.post(
  "/upload",
  upload.single("resume"),

  async (req, res) => {

    try {

      // CHECK FILE

      if (!req.file) {

        return res.status(400).json({
          error:
            "No resume uploaded",
        });

      }

      // READ PDF

      const dataBuffer =
        fs.readFileSync(
          req.file.path
        );

      const pdfData =
        await pdfParse(
          dataBuffer
        );

      const resumeText =
        pdfData.text.toLowerCase();

      // JOB DESCRIPTION

      const jobDescription =
        (
          req.body.jobDescription || ""
        ).toLowerCase();

      // SKILLS LIST

      const skillsList = [

        "java",
        "python",
        "c++",
        "sql",
        "mongodb",
        "machine learning",
        "html",
        "css",
        "javascript",
        "git",
        "react",
        "node.js",
        "express",
        "pandas",
        "numpy",
        "scikit-learn"

      ];

      // DETECTED SKILLS

      const detectedSkills =
        skillsList.filter(
          (skill) =>
            resumeText.includes(
              skill
            )
        );

      // MISSING SKILLS

      const missingSkills =
        skillsList.filter(
          (skill) =>
            jobDescription.includes(
              skill
            ) &&
            !resumeText.includes(
              skill
            )
        );

      // ATS SCORE

      const atsScore =
        Math.min(
          100,
          detectedSkills.length * 8
        );

      // SUGGESTED ROLES

      let suggestedRoles = [];

      if (
        detectedSkills.includes(
          "machine learning"
        )
      ) {

        suggestedRoles.push(
          "AI/ML Engineer"
        );

      }

      if (
        detectedSkills.includes(
          "sql"
        )
      ) {

        suggestedRoles.push(
          "Data Analyst"
        );

      }

      if (
        detectedSkills.includes(
          "react"
        )
      ) {

        suggestedRoles.push(
          "Frontend Developer"
        );

      }

      if (
        detectedSkills.includes(
          "node.js"
        )
      ) {

        suggestedRoles.push(
          "Backend Developer"
        );

      }

      if (
        suggestedRoles.length === 0
      ) {

        suggestedRoles.push(
          "Software Developer"
        );

      }

      // FEEDBACK

      let feedback =
        "Good resume overall.";

      if (
        missingSkills.length > 0
      ) {

        feedback =
          `Consider learning: ${missingSkills.join(
            ", "
          )}`;

      }

      // DELETE TEMP FILE

      fs.unlinkSync(
        req.file.path
      );

      // RESPONSE

      res.json({

        atsScore,

        skills:
          detectedSkills,

        missingSkills,

        suggestedRoles,

        feedback,

      });

    }
    catch (error) {

      console.log(error);

      res.status(500).json({

        error:
          "Something went wrong",

      });

    }

  }
);

// START SERVER

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});