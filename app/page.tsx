"use client";

import { useEffect, useState } from "react";


export default function QuestionsPage() {
  const [name, setName] = useState(""); // Updated from questionname to name
  const [link, setLink] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [tags, setTags] = useState("");
  const [updateQuestionId, setUpdateQuestionId] = useState("");
  const [newName, setNewName] = useState(""); // Updated from newQuestionName to newName
  const [questions, setQuestions] = useState([]);

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      if (response.ok) {
        setQuestions(data);
      } else {
        console.error("Error fetching questions:", data.message);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Add question
  const handleAddQuestion = async () => {
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, // Updated from questionname to name
          link,
          difficulty,
          tags: tags.split(","),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Question added successfully!");
        fetchQuestions(); // Refresh the list after adding
      } else {
        alert(`Error: ${result.error || result.message}`);
      }
    } catch (error) {
      alert("Error adding question.");
      console.error("Add question error:", error);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id: any) => {
    try {
      const response = await fetch(`/api/questions?questionId=${id}`, {
        method: "DELETE",
      });

      // console.log(id);
      const result = await response.json();
      if (response.ok) {
        alert("Question deleted successfully!");
        fetchQuestions(); // Refresh the list after deleting
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert("Error deleting question.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Questions</h1>

      {/* Add Question Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add a New Question</h2>
        <input
          className="border p-2 w-full mb-2 text-black"
          placeholder="Question Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 text-black"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <select
          className="border p-2 w-full mb-2 bg-black"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <input
          className="border p-2 w-full mb-2 text-black"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 w-full"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
      </div>
      {/* Display Questions */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Questions List</h2>
        <ul className="list-disc pl-5">
          {questions.map((question: any) => (
            <li key={question._id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{question.name}</strong> - {question.difficulty} -{" "}
                  <a
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Link
                  </a>{" "}
                  - Tags: {question.tags.join(", ")}
                </div>
                <button
                  className="bg-red-500 text-white p-2 ml-4"
                  onClick={() => handleDeleteQuestion(question._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
