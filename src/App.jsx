import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('https://api_v1.tamojitray.in/get_questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAddQuestion = async () => {
    const questionArray = newQuestion.split(',').map(q => ({ question: q.trim() }));
    try {
      await axios.post('https://api_v1.tamojitray.in/add_questions', questionArray);
      setNewQuestion('');
      fetchQuestions();
    } catch (error) {
      console.error('Error adding questions:', error);
    }
  };

  const handleDelete = async (question) => {
    try {
      await axios.delete('https://api_v1.tamojitray.in/delete_question', { data: { question } });
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleUpdate = async (oldQuestion, newQuestion) => {
    try {
      await axios.put('https://api_v1.tamojitray.in/update_question', {
        old_question: oldQuestion,
        new_question: newQuestion,
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div>
      <h1>Question List</h1>
      <div>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Enter questions separated by commas"
        />
        <button onClick={handleAddQuestion}>Add Questions</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={index}>
              <td>{question.question}</td>
              <td>
                <button
                  onClick={() => {
                    const newQuestion = prompt('Enter new question:', question.question);
                    if (newQuestion) handleUpdate(question.question, newQuestion);
                  }}
                >
                  Update
                </button>
                <button onClick={() => handleDelete(question.question)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
