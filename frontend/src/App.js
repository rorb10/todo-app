import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 새로고침해도 데이터가 유지되도록 로컬 스토리지 연동
  const [toDos, setToDos] = useState(() => {
    const saved = localStorage.getItem("toDos");
    return saved ? JSON.parse(saved) : [];
  });
  const [toDo, setToDo] = useState("");

  // toDos 배열이 바뀔 때마다 브라우저에 자동 저장
  useEffect(() => {
    localStorage.setItem("toDos", JSON.stringify(toDos));
  }, [toDos]);

  const onChange = (e) => setToDo(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    if (toDo.trim() === "") return;
    // 고유 ID와 완료 여부(done) 속성 추가
    setToDos([{ id: Date.now(), text: toDo, done: false }, ...toDos]);
    setToDo("");
  };

  const deleteBtn = (id) => {
    setToDos(toDos.filter(item => item.id !== id));
  };

  const toggleDone = (id) => {
    setToDos(toDos.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  return (
    <div className="container">
      <h1>🚀 나의 To-Do 앱</h1>
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