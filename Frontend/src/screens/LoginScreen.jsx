import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 💡 페이지 이동을 위한 훅 추가

const LoginScreen = ({ setIsLoggedIn }) => {
  // 💡 더 이상 상위 컴포넌트에서 프롭스를 받지 않음!
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // 💡 이동 함수 선언
  const path = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${path}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (parseError) {
        console.warn("백엔드가 JSON 형식의 에러 메시지를 주지 않았습니다.");
      }

      if (response.ok) {
        const token = data?.token || data?.data?.token;

        if (token) {
          localStorage.setItem("token", token);
          setIsLoggedIn(true); // 이제 새로고침 없이 헤더 버튼이 즉시 바뀝니다!

          alert("로그인에 성공했습니다.");
          navigate("/");
        } else {
          console.error("서버 응답 성공했으나 토큰이 없습니다:", data);
          setErrorMessage("서버 응답에 토큰 정보가 누락되었습니다.");
        }
      } else {
        // 💡 response.ok가 아닐 때 (500, 400 등 에러 코드일 때)
        // 백엔드에서 준 data.message가 존재한다면 "존재하지 않는 이메일입니다."를 그대로 세팅!
        if (data && data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage(
            "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.",
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
              className="login-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {errorMessage && <p className="error-text">⚠️ {errorMessage}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div>
          <span> 아직 계정이 없으신가요?</span>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
