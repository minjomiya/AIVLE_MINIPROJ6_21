import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 초기 로드 시 localStorage에서 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.setAttribute(
      "data-theme",
      newIsDark ? "dark" : "light",
    );
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // 로컬스토리지에서 토큰 삭제
    setIsLoggedIn(false); // 로그인 상태 해제
    alert("로그아웃 되었습니다.");
    navigate("/"); // 로그아웃 후 메인 페이지로 이동 (원하는 주소로 수정 가능)
  };

  return (
    <header className="header">
      <h1 className="header-title">도서 관리</h1>
      <div className="header-actions">
        {isLoggedIn ? (
          <>
            <button className="auth-btn" onClick={() => navigate("/profile")}>
              마이페이지
            </button>
            <button className="auth-btn logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button className="auth-btn" onClick={() => navigate("/login")}>
              로그인
            </button>
            <button className="auth-btn" onClick={() => navigate("/signup")}>
              회원가입
            </button>
          </>
        )}
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {isDark ? "☀️ 라이트 모드" : "🌙 다크 모드"}
        </button>
      </div>
    </header>
  );
}

export default Header;
