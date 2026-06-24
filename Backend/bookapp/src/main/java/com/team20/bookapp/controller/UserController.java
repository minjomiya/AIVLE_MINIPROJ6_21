package com.team20.bookapp.controller;

import com.team20.bookapp.dto.UserProfileResponseDTO;
import com.team20.bookapp.dto.UserRequestDTO;
import com.team20.bookapp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}