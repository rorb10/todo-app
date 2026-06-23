const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔑 방화벽이 해제된 완벽한 MongoDB 접속 주소 (비밀번호 세팅 완료)
const MONGO_URI = "mongodb://rorb10:10rorb10@ac-ys79akd-shard-00-00.bwb7ybz.mongodb.net:27017,ac-ys79akd-shard-00-01.bwb7ybz.mongodb.net:27017,ac-ys79akd-shard-00-02.bwb7ybz.mongodb.net:27017/?ssl=true&replicaSet=atlas-kfivxt-shard-0&authSource=admin&appName=Cluster0";

// 🍃 MongoDB 연결 (혹시 모를 윈도우 네트워크 충돌 방지 옵션만 남김)
mongoose.connect(MONGO_URI, { family: 4 })
  .then(() => console.log("🍃 MongoDB 클라우드 연결 성공!"))
  .catch(err => console.error("❌ MongoDB 연결 실패:", err.message));

// 📊 데이터베이스 저장 형태(스키마)
const TodoSchema = new mongoose.Schema({
  text: String,
  done: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', TodoSchema);

// [GET] 전체 할 일 목록 가져오기 API
app.get('/api/todos', async (req, res) => {
  try {
    const toDos = await Todo.find().sort({ _id: -1 });
    const formattedToDos = toDos.map(todo => ({
      id: todo._id,
      text: todo.text,
      done: todo.done
    }));
    res.json(formattedToDos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [POST] 새로운 할 일 추가하기 API
app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new Todo({ text: req.body.text });
    await newTodo.save();
    res.json({ id: newTodo._id, text: newTodo.text, done: newTodo.done });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [PATCH] 할 일 완료 상태 토글 API
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo) {
      todo.done = !todo.done;
      await todo.save();
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [DELETE] 할 일 삭제하기 API
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 http://localhost:${PORT} 에서 달리는 중입니다!`);
});