import React, { useState } from "react";

const PasswordChangeModal = ({ isOpen, onClose, apiPath }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("현재 비밀번호:", currentPassword);
    console.log("변경할 비밀번호:", newPassword);

    // 성공 시 모달 닫기 예시
    alert("비밀번호가 성공적으로 변경되었습니다.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-lg bg-[#FAF8F5] shadow-xl">
        <br />
        <br />
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label className="block text-xl font-bold text-black mb-3">
              현재 비밀번호
            </label>
            <input
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-4 py-3.5 text-base placeholder-gray-400 focus:border-[#9AB384] focus:outline-none focus:ring-1 focus:ring-[#9AB384] transition-all"
              required
            />
          </div>

          <div className="mb-10">
            <label className="block text-xl font-bold text-black mb-3">
              변경할 비밀번호
            </label>
            <input
              type="password"
              placeholder="변경할 비밀번호를 입력하세요"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-4 py-3.5 text-base placeholder-gray-400 focus:border-[#9AB384] focus:outline-none focus:ring-1 focus:ring-[#9AB384] transition-all"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="rounded bg-[#556B43] px-6 py-2.5 font-medium text-white hover:bg-[#435534] transition-colors"
            >
              변경하기
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-200 bg-white px-6 py-2.5 font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              취소하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
