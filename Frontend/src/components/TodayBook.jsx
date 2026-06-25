import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import emptyImage from "../images/empty-image.png";

// 오늘 날짜를 YYYYMMDD 정수 시드로 변환 (로컬 기준)
function getTodaySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

// 시드를 잘 섞어 날짜별로 고르게 분산시키는 간단한 해시
function hashSeed(n) {
  let x = n;
  x = ((x >> 16) ^ x) * 0x45d9f3b;
  x = ((x >> 16) ^ x) * 0x45d9f3b;
  x = (x >> 16) ^ x;
  return Math.abs(x);
}

function TodayBook({ books }) {
  const navigate = useNavigate();

  // 같은 날엔 항상 같은 책, 날짜가 바뀌면 자동으로 다른 책
  const todayBook = useMemo(() => {
    if (!books || books.length === 0) return null;
    // id 기준 정렬로 책 도착 순서와 무관하게 결과를 고정
    const sorted = [...books].sort((a, b) => a.id - b.id);
    const index = hashSeed(getTodaySeed()) % sorted.length;
    return sorted[index];
  }, [books]);

  if (!todayBook) return null;

  const tags = todayBook.genres
    ? [...new Set(todayBook.genres.flatMap((g) => [g.mainTag, g.subTag]))]
    : [];

  return (
    <section className="today-book-section">
      <p className="today-book-heading">📖 오늘의 책</p>
      <div
        className="today-book-card"
        onClick={() => navigate(`/infobook/${todayBook.id}`)}
      >
        {todayBook.coverImageUrl?.trim() ? (
          <img
            className="today-book-image"
            src={todayBook.coverImageUrl}
            alt={todayBook.title}
          />
        ) : (
          <img className="today-book-image" src={emptyImage} alt="빈 이미지" />
        )}
        <div className="today-book-info">
          <span className="today-book-badge">오늘의 추천</span>
          <h3 className="today-book-title">{todayBook.title}</h3>
          <p className="today-book-author">저자: {todayBook.author}</p>
          <p className="today-book-content">{todayBook.content}</p>
          <div className="card-tags">
            {tags.map((tag, index) => (
              <span key={index} className="card-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TodayBook;
