import React, { useState, useEffect } from "react";
import PasswordChangeModal from "./PasswordChangeModal";

const ProfileEdit = () => {
  const [userInfo, setUserInfo] = useState({
    name: "로딩 중...",
    id: "로딩 중...",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const path = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        const response = await fetch(`${path}/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            name: data.name,
            id: data.email || data.userId,
          });
        } else if (response.status === 401) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
        } else {
          alert("회원 정보를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        alert("서버 연결에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [path]);

  const handlePasswordChange = () => {
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div style={{ ...styles.container, padding: "20px", color: "#666" }}>
        정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>회원 정보 수정</h2>
        <hr style={styles.divider} />

        <div style={styles.infoTable}>
          {/* 이름 섹션 */}
          <div style={styles.row}>
            <span style={styles.label}>이름</span>
            <span style={styles.value}>{userInfo.name}</span>
          </div>

          {/* ID 섹션 */}
          <div style={styles.row}>
            <span style={styles.label}>ID (이메일)</span>
            <span style={styles.value}>{userInfo.id}</span>
          </div>

          {/* 비밀번호 섹션 */}
          <div style={styles.row}>
            <span style={styles.label}>비밀번호</span>
            <div style={styles.passwordContainer}>
              <span style={styles.value}>***</span>
              <button style={styles.button} onClick={handlePasswordChange}>
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      </div>

      <PasswordChangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiPath={path}
      />
    </div>
  );
};

const styles = {
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#000000",
    margin: "0 0 16px 0",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e0e0e0",
    marginBottom: "24px",
  },
  infoTable: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    fontSize: "18px",
  },
  label: {
    width: "120px",
    fontWeight: "500",
    color: "#000000",
  },
  value: {
    color: "#333333",
    fontWeight: "300",
    flex: 1,
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  button: {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "20px",
    cursor: "pointer",
    outline: "none",
  },

  // --- 💡 새로 추가된 모달(팝업) 전용 스타일 ---
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
  },
  modalContainer: {
    width: "100%",
    maxWidth: "560px",
    backgroundColor: "#FAF8F5",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  modalHeader: {
    backgroundColor: "#9AB384",
    padding: "20px 32px",
  },
  modalHeaderTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "0.5px",
  },
  modalForm: {
    padding: "32px",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#777777",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "28px",
    padding: 0,
  },
  inputGroup: {
    marginBottom: "24px",
  },
  inputLabel: {
    display: "block",
    fontSize: "18px",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    outline: "none",
  },
  modalButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "36px",
  },
  submitButton: {
    padding: "10px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#556B43",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#555555",
    backgroundColor: "#ffffff",
    border: "1px solid #dcdcdc",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ProfileEdit;
