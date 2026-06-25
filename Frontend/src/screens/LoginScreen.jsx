import React, { useState } from "react";

const LoginScreen = ({ onLoginSuccess, onNavigateToSignup }) => {
  // 1. 입력 필드 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. 로그인 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // 간단한 유효성 검사
    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      // 백엔드 로그인 API 호출 (기존 인프라 주소 반영)
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공 시 발급된 JWT 토큰을 브라우저 로컬 스토리지에 저장
        localStorage.setItem("token", data.token);

        // App.jsx 등 상위 컴포넌트에 로그인 성공 알림 (유저 정보 전달)
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
        alert("로그인에 성공했습니다!");
      } else {
        // 백엔드 예외 처리 메시지 반영 (ex: 비밀번호가 틀렸습니다 등)
        setErrorMessage(
          data.message || "로그인에 실패했습니다. 정보를 확인해주세요.",
        );
      }
    } catch (error) {
      console.error("로그인 요청 에러:", error);
      setErrorMessage("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">📚 Book App Login</h2>
        <p className="login-subtitle">서비스를 이용하기 위해 로그인해주세요.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>이메일 주소</label>
            <input
              type="email"
              className="login-input"
              placeholder="example@naver.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
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

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="login-footer">
          <span style={{ color: "var(--text-secondary)" }}>
            아직 계정이 없으신가요?
          </span>
          <button
            onClick={onNavigateToSignup}
            className="signup-link-btn"
            type="button"
          >
            회원가입하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
