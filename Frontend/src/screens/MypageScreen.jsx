import React from "react";

function MyPageScreen() {
  // 1. 현재 어떤 탭이 선택되었는지 관리하는 상태 (기본값: 좋아요 한 도서)
  const [activeTab, setActiveTab] = useState("likedBooks");

  // 2. activeTab 값에 따라 파란색 박스(우측 컨텐츠)에 렌더링할 컴포넌트를 결정하는 함수
  const renderContent = () => {
    switch (activeTab) {
      case "likedBooks":
        return <MyLikedBooks />;
      case "reviews":
        return <MyReviews />;
      case "profileEdit":
        return <ProfileEdit />;
      default:
        return <MyLikedBooks />;
    }
  };

  return (
    <div className="page-container">
      <div style={styles.myPageContainer}>
        <div style={styles.sidebarBox}>
          <MyPageSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div style={styles.contentBox}>{renderContent()}</div>
      </div>
    </div>
  );
}

export default MypageScreen;
