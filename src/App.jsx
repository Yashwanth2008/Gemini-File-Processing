import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Button from "./components/Button";
import "./App.css";

function App() {
  const [response, setResponse] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      alert("Please upload an image first!");
      return;
    }

    const genAI = new GoogleGenerativeAI(
      "AIzaSyAAwRHDl2BodreDhIZmGGHAX4M1rrEHeKk"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePart = {
      inlineData: {
        data: selectedImage,
        mimeType: "image/jpeg",
      },
    };

    const prompt = "Describe the superhero in this image";

    try {
      const result = await model.generateContent([prompt, imagePart]);
      setResponse(result.response.text());
    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("An error occurred while generating content.");
    }
  };

  return (
    <div className="overall-wrapper">
      <h1>Generative AI</h1>
      <div className="input-field">
        <input type="file" onChange={handleFileChange} />
        <Button functionality={handleGenerate} title={"Generate"} />
      </div>
      <div className="response-content">
        <p>{response || "Your result will appear here."}</p>
      </div>
    </div>
  );
}

export default App;
