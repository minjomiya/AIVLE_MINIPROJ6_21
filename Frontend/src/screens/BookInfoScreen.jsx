import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackToListButton from '../components/BackToListButton';
import emptyImage from '../images/empty-image.png';

function BookInfoScreen({
  onDeleteBook,
  onUpdateBook,
  onMakeImg
}) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  // BE API로 단건 조회
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://3.16.15.240:8080/books/${id}`);
        if (!res.ok) throw new Error("책을 찾을 수 없습니다.");
        const result = await res.json();
        setBook(result.data);
      } catch (err) {
        console.error(err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <p>불러오는 중...</p>;

  if (!book) {
    return (
      <>
        <p>책을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')}>홈으로 이동</button>
      </>
    );
  }

  const handleDelete = () => {
    onDeleteBook(book.id);
    navigate('/');
  };

  const handleMakeImgClick = async () => {
    setIsGenerating(true);
    try {
      const updatedBook = await onMakeImg(book, selectedQuality);
      if (updatedBook) setBook(updatedBook);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <div className="page-container">
      <div className="book-info-top-bar">
        <BackToListButton/>
        <div className="del-update-dutton">
          <button type="delete" onClick={handleDelete}>삭제</button>
          <button type="submit" onClick={() => navigate(`/editbook/${id}`)}>수정</button>
        </div>
      </div>

      <div className="book-edit-info">
        <div className="book-edit-cover">
          {book.coverImageUrl?.trim() ? (
            <img src={book.coverImageUrl} alt={book.title} />
          ) : (
            <img src={emptyImage} alt="빈 이미지" />
          )}
        </div>
        <div className="book-side-text">
          <h1>{book.title}</h1>
          <p className="gray">저자: {book.author}</p>
          <div className="card-tags">
            <span style={{color: '#7a7a6e', fontSize: '16px'}}>장르: </span>
            {book.genres?.flatMap(g => [g.mainTag, g.subTag])
              .filter((v, i, arr) => arr.indexOf(v) === i)
              .map((tag, index) => (
                <span key={index} className="card-tag">#{tag}</span>
              ))}
          </div>
          <p className="gray">등록일: {formatDate(book.createdAt)}</p>
          <p className="gray">수정일: {formatDate(book.updatedAt)}</p>
          <p className="black">내용</p>
          <p className="black">{book.content}</p>
        </div>
      </div>

      <div className="ai-image-section">
        <h3>AI 표지 생성</h3>
        <div className="ai-input-row">
          <div className="ai-input-group">
            <label className="ai-label">생성 모델</label>
            <input type="text" value="gpt-image-2" disabled className="api-input" />
          </div>
          <div className="ai-input-group">
            <label className="ai-label">사이즈</label>
            <input type="text" value="1024x1536" disabled className="api-input" />
          </div>
        </div>
        <div>
          <label className="ai-label">퀄리티</label>
          <select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            disabled={isGenerating}
            className="quality-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button
          onClick={handleMakeImgClick}
          disabled={isGenerating}
          className={`generate-btn ${isGenerating ? 'generating' : ''}`}
        >
          {isGenerating ? "이미지 생성 중..." : "AI 이미지 생성하기"}
        </button>
      </div>
    </div>
  );
}

export default BookInfoScreen;