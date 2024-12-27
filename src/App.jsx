import React, { useState } from "react";
import Button from "./components/Button";
import "./App.css";

function App() {
  const [response, setResponse] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      alert("Please upload a PDF file first!");
      return;
    }

    const userQuestion = document.getElementById("user-question").value.trim();
    if(!userQuestion){
      console.log("Please ask a question");
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("question", userQuestion);

    try {
      const res = await fetch("http://localhost:3000/pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to process the PDF");
      }

      const data = await res.json();
      setResponse(data.summary || "No summary generated.");
    } catch (error) {
      console.error("Error processing file:", error);
      setResponse("An error occurred while summarizing the document.");
    }
  };

  return (
    <div className="overall-wrapper">
      <h1>Generative AI PDF Summarizer</h1>
      <div className="input-field">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        {/* <Button functionality={handleGenerate} title={"Generate Summary"} /> */}
      </div>
      <div className="question-field">
        <input type="text" className="question-input" id="user-question" placeholder="Ask Me" />
        <Button functionality={handleGenerate} title={"Ask"}/>
      </div>
      <div className="response-content">
        <p>{response || "Your summary will appear here."}</p>
      </div>
    </div>
  );
}

export default App;
