// src/components/BookForm.jsx
import { useState } from 'react';

function BookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사 (공백 금지)
    if (!title.trim() || !content.trim()) {
      alert('도서 제목과 내용을 입력해주세요!');
      return;
    }

    // 부모 함수 실행하여 데이터 던지기
    onAddBook({ 
      title, 
      author, 
      content, 
      coverImageUrl: "",
      createdAt: new Date().toISOString()
    });

    // 입력창 비우기
    setTitle('');
    setAuthor('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="도서 제목" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="저자" 
        value={author} 
        onChange={e => setAuthor(e.target.value)} 
      />
      <textarea 
        placeholder="도서 본문 내용" 
        value={content} 
        onChange={e => setContent(e.target.value)} 
      />
      <button type="submit">추가하기</button>
    </form>
  );
}

export default BookForm;