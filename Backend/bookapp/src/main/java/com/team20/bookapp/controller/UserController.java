package com.team20.bookapp.controller;

import com.team20.bookapp.dto.PasswordUpdateDto;
import com.team20.bookapp.dto.UserProfileResponseDTO;
import com.team20.bookapp.dto.UserRequestDTO;
import com.team20.bookapp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** 회원가입 API */
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@Valid @RequestBody UserRequestDTO.SignUp request) {
        Long userId = userService.signUp(request);
        return ResponseEntity.ok("회원가입 성공! 생성된 회원 고유번호(uid): " + userId);
    }

    /** 로그인 API */
    @PostMapping("/login")
    public ResponseEntity<UserProfileResponseDTO> login(@RequestBody UserRequestDTO.Login request) {
        UserProfileResponseDTO response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    /** 마이페이지 조회 API */
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDTO> getProfile(HttpServletRequest request) {
        Long authenticatedUid = (Long) request.getAttribute("authenticatedUid");

        UserProfileResponseDTO response = userService.getMyProfile(authenticatedUid);
        return ResponseEntity.ok(response);
    }

    /** 회원정보 수정 API (이름 변경) */
    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponseDTO> updateProfile(
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        Long authenticatedUid = (Long) request.getAttribute("authenticatedUid");

        if (authenticatedUid == null) {
            return ResponseEntity.status(401).body(null);
        }

        String newName = body.get("name");

        if (newName == null || newName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        UserProfileResponseDTO updatedUser = userService.updateMyProfile(authenticatedUid, newName);
        return ResponseEntity.ok(updatedUser);
    }

    /** 회원 탈퇴 API */
    @DeleteMapping("/profile")
    public ResponseEntity<String> deleteAccount(HttpServletRequest request) {
        Long authenticatedUid = (Long) request.getAttribute("authenticatedUid");

        if (authenticatedUid == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        userService.deleteMyAccount(authenticatedUid);

        return ResponseEntity.ok("회원 탈퇴가 성공적으로 완료되었습니다. 그동안 이용해 주셔서 감사합니다.");
    }

    /** 로그아웃 API */
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("로그아웃 되었습니다.");//프론트에서 토큰 삭제 해줘야 함★★★★★★★★
    }

    /** 비밀번호 변경 API */
    @PostMapping("/profile/update-password")
    public ResponseEntity<String> updatePassword(
            HttpServletRequest request,
            @RequestBody PasswordUpdateDto passwordUpdateDto) {

        Long uid = (Long) request.getAttribute("authenticatedUid");
        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요한 서비스입니다.");
        }

        try {
            userService.updatePassword(uid, passwordUpdateDto);
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            // 현재 비밀번호가 틀렸거나 유저가 없는 경우 예외 처리
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}