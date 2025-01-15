import React, { useState } from "react";
import axios from "axios";

const UserSubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    socialMediaHandle: "",
    files: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("socialMediaHandle", formData.socialMediaHandle);
      formData.files.forEach((file) => {
        data.append("files", file);
      });

      const response = await axios.post("http://localhost:5000/api/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
      setFormData({
        name: "",
        socialMediaHandle: "",
        files: [],
      });
      document.getElementById("files").value = ""; // Clear the file input
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "5% auto",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <center>
        <h1
          style={{
            fontSize: "24px",
            marginBottom: "20px",
          }}
        >
          User Submission Form
        </h1>
      </center>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={{
              width: "98%",
              margin:"auto",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="socialMediaHandle"
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Social Media Handle:
          </label>
          <input
            type="text"
            id="socialMediaHandle"
            name="socialMediaHandle"
            value={formData.socialMediaHandle}
            onChange={handleInputChange}
            style={{
              width: "98%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="files"
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Upload Images:
          </label>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            onChange={handleFileChange}
            style={{
              width: "98%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            display: "block",
            width: "10%",
            backgroundColor: isSubmitting ? "#ccc" : "#007bff",
            color: "#fff",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default UserSubmissionForm;
