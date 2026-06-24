package com.team20.bookapp.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users") // user는 SQL 예약어일 수 있으므로 테이블명 명시 추천
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uid;

    @Column(nullable = false, length = 20)
    @NotBlank
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    @NotBlank
    @Email
    private String email; // 아이디로 사용

    @Column(nullable = false, length = 100) // 암호화된 비밀번호가 저장되므로 길게 설정
    @NotBlank
    private String password;

    @Column(nullable = false)
    private LocalDate birthDate; // 생년월일

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // 회원이 작성한 리뷰 목록 (1:N)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    // 회원이 누른 좋아요 목록 (1:N)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookLike> bookLikes = new ArrayList<>();

    // [선택] 좋아하는 장르 매핑 (중간 테이블 구조에 따라 변경 가능)
    // 여기서는 기존 BookTagMap과 유사하게 UserTagMap(가칭)이 있다고 가정하거나 String 리스트로 간단히 처리할 수 있습니다.
    // 예시: 간단하게 텍스트나 별도 매핑 테이블로 처리

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}