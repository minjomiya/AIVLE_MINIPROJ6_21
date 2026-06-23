import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BackToListButton from "../components/BackToListButton";

function BookAddScreen({ onAddBook }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !content.trim()) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    onAddBook({
      title: title,
      author: author,
      content: content,
      coverImageUrl: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    navigate("/");
  };

  return (
    <>
      <BackToListButton />

      <h2 className="subtitle">책 등록</h2>
      {/* 입력 폼 */}
      <form onSubmit={handleSubmit}>
        <div>
          <label className="form-label" htmlFor="title">
            제목
          </label>
          <input
            className="form-input"
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            maxLength={30}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="author">
            저자
          </label>
          <input
            className="form-input"
            id="author"
            type="text"
            placeholder="저자를 입력하세요"
            value={author}
            maxLength={20}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="content">
            내용
          </label>
          <textarea
            className="form-textarea"
            id="content"
            placeholder="책 내용을 입력하세요"
            rows="10"
            value={content}
            maxLength={400}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="char-count">
              {Math.min(content.length, 400)} / 400자
          </p> 
        </div>

        {/* 하단 버튼들 */}
        <div>
          <button type="submit">등록하기</button>
          <button type="button" onClick={() => navigate("/")}>
            취소하기
          </button>
        </div>
      </form>
    </>
  );
}

export default BookAddScreen;
