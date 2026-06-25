package com.team20.bookapp.service;

import com.team20.bookapp.domain.User;
import com.team20.bookapp.dto.PasswordUpdateDto;
import com.team20.bookapp.dto.UserRequestDTO;
import com.team20.bookapp.dto.UserProfileResponseDTO;
import com.team20.bookapp.exception.EmailDuplicateException;
import com.team20.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.team20.bookapp.config.JwtUtil;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /** 회원가입 */
    @Transactional
    public Long signUp(UserRequestDTO.SignUp request) {
        // 이메일 중복 검사
        userRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {
                    throw new EmailDuplicateException("이미 가입된 이메일입니다. email=" + request.getEmail());
                });

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setBirthDate(request.getBirthDate());

        User savedUser = userRepository.save(user);
        return savedUser.getUid();
    }

    /** 로그인 */
    @Transactional(readOnly = true)
    public UserProfileResponseDTO login(UserRequestDTO.Login request) {
        // 이메일로 유저 상자 꺼내오기
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        // 꺼내온 데이터와 입력 데이터 대조
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 로그인 성공 시 프로필 정보 반환
        String token = jwtUtil.createToken(user.getUid());

        return UserProfileResponseDTO.from(user, token);
    }

    /** 마이페이지 조회 */
    @Transactional(readOnly = true)
    public UserProfileResponseDTO getMyProfile(Long uid) {
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new IllegalArgumentException("해당 회원을 찾을 수 없습니다. id=" + uid));
        return UserProfileResponseDTO.from(user, null);
    }

    /** 회원 정보 수정 */
    @Transactional
    public UserProfileResponseDTO updateMyProfile(Long uid, String newName) {
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        user.setName(newName);

        return UserProfileResponseDTO.from(user, null);
    }

    /** 회원 탈퇴 */
    @Transactional
    public void deleteMyAccount(Long uid) {
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        if (user.getReviews() != null) {
            user.getReviews().clear();
        }
        if (user.getBookLikes() != null) {
            user.getBookLikes().clear();
        }

        userRepository.delete(user);
    }

    @Transactional
    public void updatePassword(Long uid, PasswordUpdateDto dto) {
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        String encodedNewPassword = passwordEncoder.encode(dto.getNewPassword());
        user.setPassword(encodedNewPassword);
    }


}