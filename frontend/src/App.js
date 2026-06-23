import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [toDos, setToDos] = useState([]);
  const [toDo, setToDo] = useState("");

  // 1. [서버에서 데이터 가져오기] 앱이 켜질 때 백엔드에 GET 요청
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      const data = await response.json();
      setToDos(data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const onChange = (e) => setToDo(e.target.value);

  // 2. [서버에 데이터 추가하기] 버튼 누를 때 백엔드에 POST 요청
  const onSubmit = async (e) => {
    e.preventDefault();
    if (toDo.trim() === "") return;

    try {
      await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: toDo })
      });
      setToDo("");
      fetchTodos(); // 등록 후 목록 새로고침
    } catch (error) {
      console.error("추가 실패:", error);
    }
  };

  // 3. [서버에서 데이터 삭제하기] ❌ 누를 때 백엔드에 DELETE 요청
  const deleteBtn = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}`, { method: 'DELETE' });
      fetchTodos(); // 삭제 후 목록 새로고침
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  // 4. [서버 상태 토글] 글씨 누를 때 백엔드에 PATCH 요청
  const toggleDone = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}`, { method: 'PATCH' });
      fetchTodos(); // 토글 후 목록 새로고침
    } catch (error) {
      console.error("토글 실패:", error);
    }
  };

  return (
    <div className="container">
      <h1>🚀 연동형 To-Do 앱</h1>
      <form onSubmit={onSubmit}>
        <input 
          onChange={onChange} 
          value={toDo} 
          type="text" 
          placeholder="할 일을 입력하세요..." 
        />
        <button type="submit">추가</button>
      </form>
      <ul className="todo-list">
        {toDos.map((item) => (
          <li key={item.id} className={item.done ? "done" : ""}>
            <span onClick={() => toggleDone(item.id)} className="text">
              {item.text}
            </span>
            <button onClick={() => deleteBtn(item.id)} className="delete-btn">❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;