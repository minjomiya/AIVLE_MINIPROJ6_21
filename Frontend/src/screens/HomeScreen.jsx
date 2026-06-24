import { useNavigate } from "react-router-dom";
import BookList from "../components/BookList";
import { useState, useEffect } from "react";

// 대분류 - 소분류 데이터
const GENRE_DATA = {
  소설: [
    "소설일반",
    "장편소설",
    "단편소설",
    "추리/미스터리",
    "판타지",
    "SF",
    "로맨스",
    "역사소설",
    "청소년소설",
    "고전소설",
  ],
  "시/에세이": ["시", "에세이", "명상/치유"],
  "인문/사회": ["인문학일반", "심리학", "정치/사회", "법학"],
  "취미/실용/스포츠": ["요리", "취미/공예", "건강/운동", "여행", "스포츠"],
  "경제/경영": [
    "경영일반",
    "경제일반",
    "마케팅/세일즈",
    "재테크/투자",
    "리더십",
    "CEO/비즈니스",
  ],
  자기계발: ["성공처세", "자기관리", "대화법"],
  "역사/문화": ["역사", "문화"],
  종교: ["종교일반", "기독교", "불교", "천주교", "기타종교"],
  "예술/대중문화": [
    "예술일반",
    "미술",
    "음악",
    "영화",
    "대중문화",
    "사진",
    "디자인",
  ],
  "기술/공학/과학": ["IT/컴퓨터", "과학", "기술/공학"],
  "어린이/유아": ["유아", "그림책", "아동문학", "학습/교양"],
};

function HomeScreen({ books }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("전체 장르");
  const [selectedSubTag, setSelectedSubTag] = useState("전체");
  const [displayedBooks, setDisplayedBooks] = useState(books);

  // 장르/서브태그 변경 시 BE 카테고리 API 호출
  useEffect(() => {
    const fetchByGenre = async () => {
      if (selectedGenre === "전체 장르") {
        setDisplayedBooks(books);
        return;
      }

      try {
        let url = `/books/search/category?mainTag=${encodeURIComponent(selectedGenre)}`;
        if (selectedSubTag !== "전체") {
          url += `&subTag=${encodeURIComponent(selectedSubTag)}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("필터링 실패");
        const result = await res.json();
        setDisplayedBooks(result.data);
      } catch (err) {
        console.error(err);
        setDisplayedBooks([]);
      }
    };

    fetchByGenre();
  }, [selectedGenre, selectedSubTag, books]);

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
    setSelectedSubTag("전체");
    setSearchQuery(""); // 장르 바꾸면 검색어 초기화
  };

  // 검색 버튼 클릭 / Enter → BE /books/search/detail API 호출
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // 검색어 비어있으면 전체 or 현재 장르 필터 결과로 복귀
      if (selectedGenre === "전체 장르") {
        setDisplayedBooks(books);
      }
      return;
    }

    try {
      const url = `/books/search/detail?title=${encodeURIComponent(searchQuery)}&author=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("검색 실패");
      const result = await res.json();
      setDisplayedBooks(result.data);
    } catch (err) {
      console.error(err);
      setDisplayedBooks([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 검색어 지우면 자동으로 원래 목록 복귀
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      if (selectedGenre === "전체 장르") {
        setDisplayedBooks(books);
      } else {
        // 장르 필터 상태 유지
        const fetchByGenre = async () => {
          try {
            let url = `/books/search/category?mainTag=${encodeURIComponent(selectedGenre)}`;
            if (selectedSubTag !== "전체") {
              url += `&subTag=${encodeURIComponent(selectedSubTag)}`;
            }
            const res = await fetch(url);
            if (!res.ok) return;
            const result = await res.json();
            setDisplayedBooks(result.data);
          } catch (err) {
            console.error(err);
          }
        };
        fetchByGenre();
      }
    }
  };

  return (
    <>
      <div className="home-header">
        <p className="book-list-title">도서 목록</p>
        <div className="search-area">
          <input
            className="search-input"
            type="text"
            placeholder="제목, 저자로 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <button className="search-button" onClick={handleSearch}>
            검색
          </button>
        </div>
        <button
          className="add-book-button"
          onClick={() => navigate("/addbook")}
        >
          + 새 도서 등록
        </button>
      </div>

      <div className="genre-filter">
        {/* 대분류 드롭다운 */}
        <select
          className="genre-select"
          value={selectedGenre}
          onChange={(e) => handleGenreChange(e.target.value)}
        >
          <option>전체 장르</option>
          {Object.keys(GENRE_DATA).map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        {/* 소분류 드롭다운 - 대분류 선택시에만 표시 */}
        {selectedGenre !== "전체 장르" && (
          <select
            className="genre-select"
            value={selectedSubTag}
            onChange={(e) => setSelectedSubTag(e.target.value)}
          >
            <option value="전체">전체</option>
            {GENRE_DATA[selectedGenre].map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        )}
      </div>

      {(() => {
        if (!books || books.length === 0) {
          return (
            <div className="no-results">
              <p>아직 등록된 도서가 없습니다.</p>
            </div>
          );
        }

        if (displayedBooks.length === 0) {
          return (
            <div className="no-results">
              <p>검색 결과가 없습니다. </p>
            </div>
          );
        }

        return <BookList books={displayedBooks} />;
      })()}
    </>
  );
}

export default HomeScreen;
