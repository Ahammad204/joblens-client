// src/utils/generateCVDocx.js
// Generates a professionally formatted .docx CV and triggers browser download.
// Install dependency: npm install docx

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  LevelFormat,
  TabStopType,
  TabStopPosition,
} from "docx";
import { saveAs } from "file-saver";
// Install file-saver: npm install file-saver

// ─── Helpers ────────────────────────────────────────────────────────────────

const sectionHeading = (text) =>
  new Paragraph({
    spacing: { before: 240, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "41b39d", space: 1 },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 24,
        font: "Arial",
        color: "2E2E2E",
      }),
    ],
  });

const bulletPoint = (text) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 20, font: "Arial" })],
  });

const spacer = (after = 120) =>
  new Paragraph({ spacing: { after }, children: [] });

// ─── Main Builder ────────────────────────────────────────────────────────────

function buildDocxDocument(cv) {
  const children = [];

  // ── NAME (Header) ──────────────────────────────────────────────────
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: cv.personalInfo?.name || "Your Name",
          bold: true,
          size: 48, // 24pt
          font: "Arial",
          color: "1A1A1A",
        }),
      ],
    })
  );

  // ── CONTACT LINE ──────────────────────────────────────────────────
  const contactParts = [
    cv.personalInfo?.phone,
    cv.personalInfo?.email,
    cv.personalInfo?.portfolio,
    cv.personalInfo?.github,
  ].filter(Boolean);

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: contactParts.join(" | "),
          size: 18,
          font: "Arial",
          color: "555555",
        }),
      ],
    })
  );

  // ── PROFILE / SUMMARY ──────────────────────────────────────────────
  if (cv.professionalSummary) {
    children.push(sectionHeading("Profile"));
    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: cv.professionalSummary,
            size: 20,
            font: "Arial",
            color: "333333",
          }),
        ],
      })
    );
  }

  // ── EDUCATION ──────────────────────────────────────────────────────
  if (cv.personalInfo?.education) {
    children.push(sectionHeading("Education"));

    // University row — name left, location right
    children.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 40 },
        children: [
          new TextRun({ text: "BGC Trust University Bangladesh", bold: true, size: 20, font: "Arial" }),
          new TextRun({ text: "\t", size: 20, font: "Arial" }),
          new TextRun({ text: "Chandanaish, Chattogram", size: 20, font: "Arial", color: "555555" }),
        ],
      })
    );

    // Degree row — degree left, year right
    children.push(
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: cv.personalInfo.education,
            size: 20,
            font: "Arial",
            italics: true,
          }),
          new TextRun({ text: "\t", size: 20, font: "Arial" }),
          new TextRun({ text: "2023 – Present", size: 20, font: "Arial", color: "555555" }),
        ],
      })
    );
  }

  // ── SKILLS ────────────────────────────────────────────────────────
  const hasSkills = cv.skills?.length > 0;
  const hasTools = cv.tools?.length > 0;

  if (hasSkills || hasTools) {
    children.push(sectionHeading("Skills"));

    if (hasSkills) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "Client Side / Backend:  ", bold: true, size: 20, font: "Arial" }),
            new TextRun({ text: cv.skills.join(", "), size: 20, font: "Arial" }),
          ],
        })
      );
    }

    if (hasTools) {
      children.push(
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Tools & Platforms:  ", bold: true, size: 20, font: "Arial" }),
            new TextRun({ text: cv.tools.join(", "), size: 20, font: "Arial" }),
          ],
        })
      );
    }
  }

  // ── EXPERIENCE ────────────────────────────────────────────────────
  if (cv.experience?.length > 0) {
    children.push(sectionHeading("Experience"));

    cv.experience.forEach((exp) => {
      // Company + Duration row
      children.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { after: 40 },
          children: [
            new TextRun({ text: exp.company || "", bold: true, size: 22, font: "Arial" }),
            new TextRun({ text: "\t", size: 20, font: "Arial" }),
            new TextRun({ text: exp.duration || "", size: 20, font: "Arial", color: "555555" }),
          ],
        })
      );

      // Role title
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: exp.role || "",
              size: 20,
              font: "Arial",
              italics: true,
              color: "41b39d",
            }),
          ],
        })
      );

      // Bullet points
      (exp.description || []).forEach((point) => children.push(bulletPoint(point)));
      children.push(spacer(120));
    });
  }

  // ── PROJECTS ──────────────────────────────────────────────────────
  if (cv.projects?.length > 0) {
    children.push(sectionHeading("Projects"));

    cv.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: proj.title || "", bold: true, size: 20, font: "Arial" }),
          ],
        })
      );

      (proj.description || []).forEach((point) => children.push(bulletPoint(point)));
      children.push(spacer(120));
    });
  }

  // ── RECOMMENDATIONS ───────────────────────────────────────────────
  // if (cv.recommendations?.length > 0) {
  //   children.push(sectionHeading("Recommendations"));
  //   cv.recommendations.forEach((rec) =>
  //     children.push(
  //       new Paragraph({
  //         numbering: { reference: "bullets", level: 0 },
  //         spacing: { after: 60 },
  //         children: [
  //           new TextRun({ text: rec, size: 20, font: "Arial", color: "555555" }),
  //         ],
  //       })
  //     )
  //   );
  // }

  // ── DOCUMENT ASSEMBLY ─────────────────────────────────────────────
  return new Document({
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u25A0", // filled square bullet matching your CV style
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 480, hanging: 240 } },
                run: { size: 16, color: "41b39d" }, // teal bullets
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 }, // US Letter
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }, // 0.75 inch
          },
        },
        children,
      },
    ],
  });
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Call this to trigger a .docx download in the browser.
 * @param {object} cv - The generatedCV object from /api/cv/generate
 */
export const downloadCVasDocx = async (cv) => {
  const doc = buildDocxDocument(cv);
  const blob = await Packer.toBlob(doc);
  const fileName = `${cv.personalInfo?.name?.replace(/\s+/g, "_") || "CV"}_Resume.docx`;
  saveAs(blob, fileName);
};
