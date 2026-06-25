import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import BookInfoScreen from "./screens/BookInfoScreen";
import BookEditScreen from "./screens/BookEditScreen";
import BookAddScreen from "./screens/BookAddScreen";
import Header from "./components/Header";
import BookForm from "./components/BookForm";
import BookDetail from "./components/BookDetail";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const path = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);

  const handleFetchError = (err, defaultMessage) => {
    console.error(err);
    if (err.message === "Failed to fetch") {
      alert("네트워크 오류: 서버 연결을 확인해주세요.");
    } else {
      alert(defaultMessage);
    }
  };

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch(path + "/books");
        if (!res.ok) throw new Error("서버 응답 오류");
        const result = await res.json();
        setBooks(result.data); // ✅ .data 추가
      } catch (err) {
        handleFetchError(err, err.message);
      }
      setLoading(false);
    }
    loadBooks();
  }, []);

  const handleAddBook = async (newBook) => {
    try {
      let genre = "";
      let subTag = [];

      if (apiKey) {
        console.log("AI 장르 자동 분석 시작");

        const OPENAI_CHAT_API_URL =
          "https://api.openai.com/v1/chat/completions";
        const TAG_CATEGORIES = `
        - 소설 : 소설일반, 장편소설, 단편소설, 추리/미스터리, 판타지, SF, 로맨스, 역사소설, 청소년소설, 고전소설
        - 시/에세이 : 시, 에세이, 명상/치유
        - 인문/사회 : 인문학일반, 심리학, 정치/사회, 법학
        - 취미/실용/스포츠 : 요리, 취미/공예, 건강/운동, 여행, 스포츠
        - 경제/경영 : 경영일반, 경제일반, 마케팅/세일즈, 재테크/투자, 리더십, CEO/비즈니스
        - 자기계발 : 성공처세, 자기관리, 대화법
        - 역사/문화 : 역사, 문화
        - 종교 : 종교일반, 기독교, 불교, 천주교, 기타종교
        - 예술/대중문화 : 예술일반, 미술, 음악, 영화, 대중문화, 사진, 디자인
        - 기술/공학/과학 : IT/컴퓨터, 과학, 기술/공학
        - 어린이/유아 : 유아, 그림책, 아동문학, 학습/교양
        `;

        const prompt = `
        다음 책의 제목과 내용을 분석해서 장르를 분류해주세요.
        아래 카테고리 목록에서 대분류(genre) 1개와 소분류(subTag) 최대 2개를 선택해주세요.
        태그는 반드시 제공된 목록에서만 골라야 합니다.
        응답은 반드시 아래 JSON 형태로만 작성해주세요. 다른 텍스트는 절대 포함하지 마세요.
        예시: {"genre": "소설", "subTag": ["판타지", "청소년소설"]}

        [사용 가능한 카테고리 및 태그 목록]
        ${TAG_CATEGORIES}

        [책 정보]
        - 제목: "${newBook.title}"
        - 내용: "${newBook.content}"
        `;

        const tagRes = await fetch(OPENAI_CHAT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
          }),
        });

        if (tagRes.ok) {
          const tagData = await tagRes.json();
          const aiMessage = tagData.choices[0].message.content;
          const parsed = JSON.parse(aiMessage);

          if (Array.isArray(parsed)) {
            genre = parsed[0] ?? "";
            subTag = parsed.slice(1);
          } else {
            genre = parsed.genre ?? "";
            subTag = parsed.subTag ?? [];
          }
        } else {
          console.warn("태그 분석 실패, 태그 없이 저장을 진행합니다.");
        }
      } else {
        console.warn(".env 파일에 API 키가 없어 태그 없이 저장합니다.");
      }

      const genres = genre
        ? subTag.map((tag) => ({
            mainTag: genre,
            subTag: tag,
          }))
        : [];

      const finalBookData = {
        ...newBook,
        genres,
      };

      const res = await fetch(path + "/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalBookData),
      });

      if (res.status === 400)
        throw new Error("잘못된 요청입니다. 입력값을 확인해주세요.");
      if (res.status === 500)
        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      if (!res.ok) throw new Error("등록 실패");

      const result = await res.json();
      setBooks([result.data, ...books]); // ✅ .data 추가
      alert("등록 완료!");
    } catch (err) {
      handleFetchError(err, err.message);
    }
  };

  const handleUpdateBook = async (updatedBook) => {
    try {
      const res = await fetch(`${path}/books/${updatedBook.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });

      if (res.status === 404) throw new Error("수정할 책을 찾을 수 없습니다.");
      if (res.status === 500)
        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      if (!res.ok) throw new Error("수정 실패");

      const result = await res.json();
      setBooks(books.map((b) => (b.id == result.data.id ? result.data : b))); // ✅ .data 추가
    } catch (err) {
      handleFetchError(err, err.message);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${path}/books/${id}`, {
        method: "DELETE",
      });

      if (res.status === 404) throw new Error("삭제할 책을 찾을 수 없습니다.");
      if (res.status === 500)
        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      if (!res.ok) throw new Error("삭제 실패");

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      alert("삭제 성공~~~");
    } catch (err) {
      handleFetchError(err, err.message);
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>에러: {error}</p>;

  const handleGenerateImage = async (selectedBook, selectedQuality) => {
    if (!apiKey) {
      alert("API 키가 설정되지 않았습니다.");
      return;
    }

    console.log("함수 호출");
    try {
      const OPENAI_IMAGE_API_URL =
        "https://api.openai.com/v1/images/generations";

      const prompt = `
      매우 상세한 책 표지 이미지를 생성해주세요.

      [텍스트 지침]
      - 제목: "${selectedBook.title}"
      - 저자명: "${selectedBook.author}"
      
      [시각적 지침]
      - 다음 줄거리와 핵심 내용을 바탕으로 표지 일러스트를 생성해주세요: "${selectedBook.content}"

      [스타일 및 분위기]
      - 스타일: 책의 장르와 분위기에 맞는 스타일로 표지를 디자인해주세요.
      - 퀄리티: "${selectedQuality}"
      `;

      const CreateImage = await fetch(OPENAI_IMAGE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-image-2",
          prompt,
          n: 1,
          size: "1024x1536",
          quality: selectedQuality,
        }),
      });

      if (CreateImage.status === 401)
        throw new Error("API 키가 유효하지 않습니다.");
      if (CreateImage.status === 429)
        throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      if (!CreateImage.ok) throw new Error("OpenAI 요청 실패");

      let responseData;
      try {
        responseData = await CreateImage.json();
      } catch {
        throw new Error("응답 형식이 올바르지 않습니다.");
      }

      const b64Image = responseData.data[0].b64_json;
      if (!b64Image)
        throw new Error("이미지 데이터가 응답에 포함되어 있지 않습니다.");

      const imageUrl = `data:image/png;base64,${b64Image}`;

      const updateRes = await fetch(
        `${path}/books/${selectedBook.id}/cover`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coverImageUrl: imageUrl,
          }),
        },
      );

      if (updateRes.status === 404)
        throw new Error("업데이트할 책을 찾을 수 없습니다.");
      if (updateRes.status === 500)
        throw new Error("서버 오류가 발생했습니다.");
      if (!updateRes.ok) throw new Error("책 정보 업데이트 실패");

      const updateResult = await updateRes.json();
      setBooks((prevBooks) =>
        prevBooks.map(
          (book) => (book.id === selectedBook.id ? updateResult.data : book), // ✅ .data 추가
        ),
      );
      setCurrentBook(updateResult.data); // ✅ .data 추가
      alert("책 이미지가 성공적으로 생성되고 업데이트되었습니다!");
      return updateResult.data;
    } catch (err) {
      handleFetchError(err, "이미지 생성 또는 업데이트에 실패했습니다.");
    }
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen books={books} />} />
        <Route
          path="/infobook/:id"
          element={
            <BookInfoScreen
              onDeleteBook={handleDeleteBook}
              onUpdateBook={handleUpdateBook}
              onMakeImg={handleGenerateImage}
            />
          }
        />
        <Route
          path="/addbook"
          element={<BookAddScreen onAddBook={handleAddBook} />}
        />
        <Route
          path="/editbook/:id"
          element={<BookEditScreen onUpdateBook={handleUpdateBook} />}
        />
      </Routes>
    </>
  );
}

export default App;
