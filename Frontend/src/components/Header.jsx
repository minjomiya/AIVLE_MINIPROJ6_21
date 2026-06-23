import { useState, useEffect } from 'react';

function Header() {
  const [isDark, setIsDark] = useState(false);

  // 초기 로드 시 localStorage에서 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.setAttribute('data-theme', newIsDark ? 'dark' : 'light');
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <header className="header">
      <h1 className="header-title">도서 관리</h1>
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {isDark ? '☀️ 라이트 모드' : '🌙 다크 모드'}
      </button>
    </header>
  );
}

export default Header;
