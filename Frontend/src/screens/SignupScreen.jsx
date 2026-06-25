import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const path = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!name || !email || !password || !birthdate) {
      setErrorMessage("모든 필드를 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${path}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, birthDate: birthdate }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (parseError) {
        console.warn("백엔드가 JSON 형식의 메시지를 주지 않았습니다.");
      }

      if (response.ok) {
        alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        if (data && data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage(
            "회원가입에 실패했습니다. 입력 정보를 다시 확인해주세요.",
          );
        }
      }
    } catch (error) {
      console.error("네트워크 통신 에러:", error);
      setErrorMessage("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="page-container">
        <Link to="/">← 목록으로 돌아가기</Link>

        <form onSubmit={handleSubmit}>
          <div>
            <label>사용자 이름</label>
            <input
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label>생년월일</label>
            <input
              type="date" // 달력 UI로 선택할 수 있게 설정 (YYYY-MM-DD 형식으로 관리됨)
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label>이메일 주소</label>
            <input
              type="email"
              placeholder="example@naver.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {errorMessage && <p className="error-text">⚠️ {errorMessage}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "가입 처리 중..." : "회원가입"}
          </button>
        </form>

        <div>
          <span>이미 계정이 있으신가요? </span>
          <Link to="/login">로그인하기</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
