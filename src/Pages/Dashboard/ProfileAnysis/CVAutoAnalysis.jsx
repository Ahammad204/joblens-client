/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../componet/Shared/Loading/Loading";
import axiosPublic from "../../../utils/axiosPublic";
import { analyzeCV } from "../../../utils/skillExtractor";
import { downloadCVasDocx } from "./generateCVDocx";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import CVDocument from "../../../componet/CVDocument/CVDocument";


// --- Utility Components for Editing ---

// Editable Input Field for single-value properties
const EditableInput = ({ label, initialValue, onSave }) => {
  const [value, setValue] = useState(initialValue || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (value.trim() !== (initialValue || "")) {
      onSave(value.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex gap-2">
        {!isEditing ? (
          <p
            onClick={() => setIsEditing(true)}
            className="text-lg font-semibold text-gray-900 flex-grow cursor-pointer p-2 border border-transparent hover:border-gray-300 rounded-md transition-all"
          >
            {value || `Add your ${label.toLowerCase()}`}
          </p>
        ) : (
          <>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="flex-grow p-2 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-lg"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Editable Tag component (Simplified for profile editing)
const EditableTag = ({ text, onRemove }) => {
  return (
    <div className="bg-red-100 hover:bg-red-200 transition-colors px-4 py-1 rounded-full flex items-center gap-2 shadow-sm text-red-700 font-medium text-sm">
      <span>{text}</span>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 focus:outline-none"
        aria-label="Remove skill"
      >
        &times;
      </button>
    </div>
  );
};

// Section for Skills/Tools (Handles array-based data)
const EditableTagSection = ({ title, items, onUpdate }) => {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    const itemToAdd = newItem.trim();
    if (itemToAdd && !items.includes(itemToAdd)) {
      onUpdate([...items, itemToAdd]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    onUpdate(items.filter((item) => item !== itemToRemove));
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-xl border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3 mb-4">
        {items.map((item, i) => (
          <EditableTag
            key={i}
            text={item}
            onRemove={() => handleRemoveItem(item)}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Add new ${title.toLowerCase().slice(0, -1)}`}
          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          className="flex-grow p-2 border border-gray-300 rounded-lg text-sm"
        />
        <button
          onClick={handleAddItem}
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Add
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---

const CVAutoAnalysis = () => {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [generatedCV, setGeneratedCV] = useState(null);
  const [loadingCV, setLoadingCV] = useState(false);
  // Trained ML model prediction (Linear SVM), shown next to the analysis
  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState("");

  const generateCV = async () => {
    try {
      setLoadingCV(true);
      const res = await axiosPublic.post(
        "/api/cv/generate",
        {},
        { withCredentials: true },
      );
      setGeneratedCV(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCV(false);
    }
  };
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await axiosPublic.get("/api/me", { withCredentials: true });
      // Use the fetched user data to populate the editable state
      setProfileData(res.data.user);
      // Show a previously saved ML prediction, if one exists
      if (res.data.user?.mlPrediction) {
        setMlPrediction(res.data.user.mlPrediction);
      }
    } catch (err) {
      console.error("Fetch User Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handlers to update the state and save to server
  const handleProfileUpdate = async (field, value) => {
    if (!profileData || !user?._id) return;

    // Optimistic UI update
    const updatedData = { ...profileData, [field]: value };
    setProfileData(updatedData);

    try {
      const res = await axiosPublic.patch(
        `/users/${user._id}`,
        { [field]: value },
        { withCredentials: true },
      );
      // Update the global user context (if necessary, depends on useAuth implementation)
      // setUser(res.data); // Assuming server returns the updated user object
      console.log(`${field} updated successfully.`);
    } catch (err) {
      console.error(`Update ${field} Error:`, err);
      // Revert if API fails (optional, but good practice)
      // setProfileData(profileData);
    }
  };

  const handleArrayUpdate = async (field, newArray) => {
    handleProfileUpdate(field, newArray);
  };

  const runAnalysis = async () => {
    if (!user?.resume) return;

    try {
      setReanalyzing(true);
      const analysis = await analyzeCV(user.resume);

      // Trained ML model prediction (Linear SVM) — runs next to the
      // local rule-based analysis. If the ML service is down, the rest
      // of the analysis still saves; the error is shown, not fatal.
      let ml = null;
      try {
        setMlLoading(true);
        setMlError("");
        const mlRes = await axiosPublic.post(
          "/api/ml/predict",
          { cvText: user.resume },
          { withCredentials: true },
        );
        ml = mlRes.data?.data || null;
        setMlPrediction(ml);
      } catch (mlErr) {
        console.error("ML Prediction Error:", mlErr);
        setMlError(
          mlErr?.response?.data?.message || "ML prediction unavailable.",
        );
      } finally {
        setMlLoading(false);
      }

      // Save analysis results to database AND update the current state
      await axiosPublic.post(
        "/api/cv/save",
        {
          skills: analysis.skills,
          tools: analysis.tools,
          roles: analysis.roles,
          explain: analysis.explain,
          mlPrediction: ml,
        },
        { withCredentials: true },
      );

      // Update profileData state with new analysis results
      setProfileData((prev) => ({
        ...prev,
        skills: analysis.skills,
        tools: analysis.tools,
        roles: analysis.roles,
        cvAnalysis: { explain: analysis.explain, updatedAt: new Date() },
        ...(ml ? { mlPrediction: ml } : {}),
      }));
    } catch (err) {
      console.error("CV Analysis Save Error:", err);
    } finally {
      setReanalyzing(false);
    }
  };

  if (loading || !profileData) return <Loading />;

  const {
    name,
    email,
    education,
    experience,
    careerTrack,
    skills,
    tools,
    cvAnalysis,
    roles,
  } = profileData;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl border border-gray-100">
      <h2 className="text-4xl font-extrabold mb-8 text-[#41b39d] border-b pb-4">
        <span role="img" aria-label="profile"></span> Your Profile
      </h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Personal Details
          </h3>
          <EditableInput
            label="Full Name"
            initialValue={name}
            onSave={(value) => handleProfileUpdate("name", value)}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email (Cannot Edit)
            </label>
            <p className="text-lg font-semibold text-gray-500 p-2">{email}</p>
          </div>
          <EditableInput
            label="Education"
            initialValue={education}
            onSave={(value) => handleProfileUpdate("education", value)}
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Career Info</h3>
          <EditableInput
            label="Experience Level"
            initialValue={experience}
            onSave={(value) => handleProfileUpdate("experience", value)}
          />
          <EditableInput
            label="Career Track"
            initialValue={careerTrack}
            onSave={(value) => handleProfileUpdate("careerTrack", value)}
          />
          <EditableInput
            label="Roles (Derived from CV)"
            initialValue={roles?.join(", ") || "N/A"}
            onSave={(value) =>
              handleProfileUpdate(
                "roles",
                value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* Skills and Tools */}
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        Skills & Tools (Editable)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        <EditableTagSection
          title="Skills"
          items={skills || []}
          onUpdate={(newSkills) => handleArrayUpdate("skills", newSkills)}
        />
        <EditableTagSection
          title="Tools"
          items={tools || []}
          onUpdate={(newTools) => handleArrayUpdate("tools", newTools)}
        />
      </div>

      <hr className="my-8 border-gray-200" />

      {/* CV Analysis Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          <span role="img" aria-label="analysis">
            📄
          </span>{" "}
          CV Auto-Analysis Summary
        </h3>

        <p className="text-gray-600 mb-4 text-sm">
          This data was automatically extracted from your resume and is used
          for job matching and recommendations. You can manually edit the
          skills/tools above, or re-run the analysis below.
        </p>

        {cvAnalysis?.explain ? (
          <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-inner">
            <h4 className="font-semibold text-[#41b39d] mb-2">
              Analysis:
            </h4>
            <p className="text-gray-700 leading-relaxed text-sm">
              {cvAnalysis.explain}
            </p>
            <p className="mt-3 text-xs text-gray-500">
              Last updated: {new Date(cvAnalysis.updatedAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No CV analysis data found.
          </p>
        )}

        {/* Trained ML Model Prediction — next to the rule-based result */}
        <div className="mt-6">
          <h4 className="font-semibold text-[#41b39d] mb-2">
            🤖 ML Prediction (trained model):
          </h4>
          {mlLoading ? (
            <p className="text-gray-500 text-sm">
              Predicting with the trained model...
            </p>
          ) : mlPrediction ? (
            <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 shadow-inner">
              <p className="text-gray-800 text-lg">
                Best role:{" "}
                <span className="font-bold">
                  {mlPrediction.predicted_category}
                </span>{" "}
                <span className="text-sm text-gray-500">
                  (relative score {mlPrediction.confidence.toFixed(4)})
                </span>
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                {mlPrediction.top_3?.map((t, i) => (
                  <li key={i}>
                    {i + 1}. {t.category} — relative score{" "}
                    {t.probability.toFixed(4)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                Trained Linear SVM on 11,697 CVs. Scores are relative, not
                calibrated probabilities.
              </p>
            </div>
          ) : mlError ? (
            <p className="text-gray-500 text-sm">{mlError}</p>
          ) : (
            <p className="text-gray-500 text-sm">
              No ML prediction yet — run the CV analysis to get one.
            </p>
          )}
        </div>

        <button
          onClick={runAnalysis}
          disabled={reanalyzing || !user?.resume}
          className={`mt-6 w-full cursor-pointer ${reanalyzing ? "bg-gray-400" : "bg-[#41b39d] "} text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg`}
        >
          {reanalyzing
            ? "Re-analyzing CV..."
            : user?.resume
              ? "Re-analyze CV"
              : "Upload Resume to Analyze"}
        </button>
      </div>

      {/* --- Generated CV Section --- */}
      <div className="mt-8">
        <button
          onClick={generateCV}
          disabled={loadingCV}
          className={`w-full cursor-pointer ${
            loadingCV ? "bg-gray-400" : "bg-[#41b39d]"
          } text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg`}
        >
          {loadingCV ? "Generating CV..." : "Generate CV"}
        </button>
      </div>

      {generatedCV && (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6 border border-gray-100">
          {/* ── Preview Header ── */}
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {generatedCV?.personalInfo?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {generatedCV?.personalInfo?.email}
              </p>
            </div>
            {/* ── DOCX Download Button ── */}
            <button
              onClick={() => downloadCVasDocx(generatedCV)}
              className="flex items-center gap-2 bg-[#41b39d] hover:bg-[#369d89] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md"
            >
              ⬇ Download as Word (.docx)
            </button>
          </div>

          {/* ── Professional Summary ── */}
          {generatedCV?.professionalSummary && (
            <div className="mb-5">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide border-b border-[#41b39d] pb-1 mb-2">
                Profile
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {generatedCV.professionalSummary}
              </p>
            </div>
          )}

          {/* ── Experience ── */}
          {generatedCV?.experience?.length > 0 && (
            <div className="mb-5">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide border-b border-[#41b39d] pb-1 mb-3">
                Experience
              </h3>
              {generatedCV.experience.map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-gray-800">{exp.company}</p>
                    <p className="text-xs text-gray-400">{exp.duration}</p>
                  </div>
                  <p className="text-sm text-[#41b39d] italic mb-1">
                    {exp.role}
                  </p>
                  <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                    {exp.description.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* ── Skills & Tools ── */}
          {(generatedCV?.skills?.length > 0 ||
            generatedCV?.tools?.length > 0) && (
            <div className="mb-5">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide border-b border-[#41b39d] pb-1 mb-2">
                Skills & Tools
              </h3>
              {generatedCV?.skills?.length > 0 && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Skills: </span>
                  {generatedCV.skills.join(", ")}
                </p>
              )}
              {generatedCV?.tools?.length > 0 && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tools: </span>
                  {generatedCV.tools.join(", ")}
                </p>
              )}
            </div>
          )}

          {/* ── Projects ── */}
          {generatedCV?.projects?.length > 0 && (
            <div className="mb-5">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide border-b border-[#41b39d] pb-1 mb-3">
                Projects
              </h3>
              {generatedCV.projects.map((proj, i) => (
                <div key={i} className="mb-3">
                  <p className="font-semibold text-gray-800 mb-1">
                    {proj.title}
                  </p>
                  <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                    {proj.description.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          

          {/* ── Recommendations ── */}
          {/* {generatedCV?.recommendations?.length > 0 && (
            <div className="mb-2">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide border-b border-[#41b39d] pb-1 mb-2">
                Recommendations
              </h3>
              <ul className="list-disc ml-5 text-sm text-gray-500 space-y-1">
                {generatedCV.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default CVAutoAnalysis;
