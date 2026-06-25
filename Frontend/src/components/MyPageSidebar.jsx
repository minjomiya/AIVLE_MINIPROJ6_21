import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const MyPageSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const path = import.meta.env.VITE_API_BASE_URL;

  const [username, setUsername] = useState("로딩 중...");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${path}/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.name || "회원");
        } else {
          console.error("프로필 정보를 가져오는 데 실패했습니다.");
          setUsername("사용자");
        }
      } catch (error) {
        console.error("프로필 API 통신 에러:", error);
        setUsername("사용자");
      }
    };

    fetchUserProfile();
  }, [path, navigate]);

  const handleDirectWithdraw = async () => {
    const confirmWithdraw = window.confirm(
      "정말로 회원 탈퇴를 진행하시겠습니까?\n탈퇴 시 모든 정보가 복구 불가능하게 삭제됩니다.",
    );

    if (!confirmWithdraw) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${path}/users/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.removeItem("token"); // 토큰 삭제
        navigate("/");
        window.location.reload(); // 상태 동기화용 새로고침
      } else {
        alert("회원 탈퇴 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      {/* 프로필 섹션 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",

            backgroundColor: "#ccc",
            borderRadius: "50%",
          }}
        ></div>
        <h3>{username} 님</h3>
      </div>

      <hr />

      {/* 라이브러리 섹션 */}
      <div>
        <h3>라이브러리</h3>
        <div
          onClick={() => setActiveTab("likes")}
          className={`menu-item ${activeTab === "likes" ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          좋아요
        </div>
        <br />
        <div
          onClick={() => setActiveTab("reviews")}
          className={`menu-item ${activeTab === "reviews" ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          리뷰
        </div>
      </div>

      <hr />

      {/* 회원정보 수정 섹션 */}
      <div>
        <h3>회원정보 수정</h3>
        <div
          onClick={() => setActiveTab("profileEdit")}
          className={`menu-item ${activeTab === "profileEdit" ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          회원정보 수정
        </div>
        <br />
        <div onClick={handleDirectWithdraw} style={{ cursor: "pointer" }}>
          회원 탈퇴
        </div>
      </div>
    </div>
  );
};

export default MyPageSidebar;
