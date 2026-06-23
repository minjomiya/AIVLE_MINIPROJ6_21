import { useNavigate, useParams } from 'react-router-dom';

function BackToListButton({
  books,
  onDeleteBook,
  onUpdateBook,
  onMakeImg
}) {
    const navigate = useNavigate();
    return(
        <div
            className="back-to-list-button"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", marginBottom: "15px" }}
        >
            ← 목록으로 돌아가기
        </div>
    );
}
export default BackToListButton;