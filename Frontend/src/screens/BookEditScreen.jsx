import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackToListButton from '../components/BackToListButton';
import emptyImage from '../images/empty-image.png';

function BookEditScreen({ onUpdateBook }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeContent, setChangeContent] = useState('');

  // BE API로 단건 조회
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://3.144.149.46:8080/books/${id}`);
        if (!res.ok) throw new Error("책을 찾을 수 없습니다.");
        const result = await res.json();
        setBook(result.data);
        setChangeContent(result.data.content ?? '');
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

  const handleSave = () => {
    onUpdateBook({
      ...book,
      content: changeContent,
    });
    navigate(`/infobook/${book.id}`);
  };

  const handleCancel = () => {
    navigate(`/infobook/${book.id}`);
  };

  return (
    <div className="page-container">
      <BackToListButton/>
      <div className="book-edit-info">
        <div className="book-edit-cover">
          {book.coverImageUrl?.trim() ? (
            <img src={book.coverImageUrl} alt={book.title} />
          ) : (
            <img src={emptyImage} alt="빈 이미지" />
          )}
        </div>
        <div className="book-edit-text">
          <h3>{book.title}</h3>
          <p>저자: {book.author}</p>
        </div>
      </div>
      <div className="book-edit-content">
        <p>내용</p>
        <div className="book-edit-textarea-box">
          <textarea
            value={changeContent}
            maxLength={400}
            onChange={(e) => setChangeContent(e.target.value)}
          />
          <p className="content-count">
            {Math.min(changeContent.length, 400)} / 400자
          </p>
        </div>
      </div>
      <div className='buttons'>
        <button type="submit" onClick={handleSave}>저장하기</button>
        <button type="button" onClick={handleCancel}>취소하기</button>
      </div>
    </div>
  );
}

export default BookEditScreen;
