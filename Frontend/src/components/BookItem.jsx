import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emptyImage from '../images/empty-image.png';

function BookItem({
  id,
  title,
  author,
  content,
  coverImageUrl,
  createdAt,
  updatedAt,
  tags
}) {
    const navigate = useNavigate();
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ko-KR');
    };
    return (
        <li
            className="book-card"
            onClick={() => navigate(`/infobook/${id}`)}
            style={{ cursor: 'pointer' }}
        >
            {coverImageUrl?.trim() ? (
                <img className="card-image" src={coverImageUrl} alt={title} />
                ) : (
                <img
                    className="card-image"
                    src={emptyImage}
                    alt="빈 이미지"
                />
            )}
            <div className="card-info">
                <h3 className="card-title">{title}</h3>
                <p className="card-content">{content}</p>
                <div className="card-tags">
                    {tags?.map((tag, index) => (
                        <span key={index} className="card-tag">#{tag}</span>
                    ))}
                </div>
            </div>
        </li>
    );
}

export default BookItem;