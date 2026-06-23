import { useState } from "react";

// 일단 기존 데이터를 불러와서 PATCH 보내야함
function BookDetail({ book, onUpdateBook, onBack }) {
  // 1. 수정 모드 토글 상태 및 기존 입력값 자동 불러오기 설정
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(book.title);
  const [editAuthor, setEditAuthor] = useState(book.author);
  const [editContent, setEditContent] = useState(book.content);

  // 2. 서버에 PATCH 요청을 보내는 비동기 함수
  const handleSaveUpdate = async () => {
    // 유효성 검사 (공백 금지)
    if (!editTitle.trim() || !editContent.trim()) {
      alert("도서 제목과 내용을 입력해주세요.");
      return;
    }

    try {
      // id만 봐도 되니까
      // json-server 규칙에 맞춰 특정 ID의 데이터만 PATCH로 부분 수정 요청
      const res = await fetch(`http://3.144.149.46:8080/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          author: editAuthor,
          content: editContent,
          updatedAt: new Date().toISOString(), // 수정 시각 업데이트
        }),
      });

      if (!res.ok) throw new Error("수정 실패");

      const updatedData = await res.json();

      // 부모 컴포넌트(App.jsx) 상태에 반영하여 화면 동기화
      onUpdateBook(updatedData);
      setIsEditing(false); // 수정 모드 종료
      alert("수정 완료!");
    } catch (err) {
      console.error(err);
      alert("수정 중 에러가 발생했습니다.");
    }
  };

  return (
    <div style={{ border: "1px solid #000", padding: "10px", margin: "10px" }}>
      <button onClick={onBack}>← 뒤로가기</button>

      {isEditing ? (
        // 수정 모드 화면?
        <div>
          <h3>도서 정보 수정</h3>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <br />
          <input
            type="text"
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
          />
          <br />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <br />
          <button onClick={handleSaveUpdate}>저장</button>
          <button onClick={() => setIsEditing(false)}>취소</button>
        </div>
      ) : (
        // 일반 상세 보기일 때 보여줄 화면
        <div>
          <h2>📖 {book.title}</h2>
          <p>저자: {book.author}</p>
          <p>내용: {book.content}</p>
          <small>등록일:{new Date(book.createdAt).toLocaleString()}</small>
          <br />
          {/*수정일 추가*/}
          {book.updatedAt && (
            <small>수정일:{new Date(book.updatedAt).toLocaleString()}</small>
          )}
          <br />
          <button onClick={() => setIsEditing(true)}>수정하기</button>
        </div>
      )}
    </div>
  );
}

export default BookDetail;
