const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000; // 백엔드 서버는 5000번 방을 씁니다.

// 미들웨어 설정 (프론트엔드와 데이터 주고받기 설정)
app.use(cors());
app.use(express.json());

// 임시 데이터베이스 역할 (메모리 배열)
let toDos = [
  { id: 1, text: "백엔드 서버 띄우기", done: false },
  { id: 2, text: "리액트와 API 연동하기", done: false }
];

// [GET] 1. 전체 할 일 목록 가져오기 API
app.get('/api/todos', (req, res) => {
  res.json(toDos);
});

// [POST] 2. 새로운 할 일 추가하기 API
app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    done: false
  };
  toDos = [newTodo, ...toDos];
  res.json(newTodo);
});

// [PATCH] 3. 할 일 완료 상태 토글(체크/해제) API
app.patch('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  toDos = toDos.map(todo => 
    todo.id === parseInt(id) ? { ...todo, done: !todo.done } : todo
  );
  res.json({ success: true });
});

// [DELETE] 4. 할 일 삭제하기 API
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  toDos = toDos.filter(todo => todo.id !== parseInt(id));
  res.json({ success: true });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 http://localhost:${PORT} 에서 달리는 중입니다!`);
});