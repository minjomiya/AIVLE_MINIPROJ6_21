import React, { useState } from "react";
import MyLikedBooks from "../components/MyLikedBooks";
import MyReviews from "../components/MyReviews";
import MyPageSidebar from "../components/MyPageSidebar";
import ProfileEdit from "../components/ProfileEdit";

function MyPageScreen() {
  const [activeTab, setActiveTab] = useState("likedBooks");

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

const styles = {
  myPageContainer: {
    display: "flex",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    gap: "20px",
  },
  sidebarBox: {
    flex: 1,
    padding: "20px",
    // border: "2px solid blue",
    borderRight: "2px solid #e0e0e0",
  },
  contentBox: {
    flex: 2,
    // border: "2px solid blue",
    borderRadius: "8px",
    padding: "20px",
  },
};

export default MyPageScreen;
