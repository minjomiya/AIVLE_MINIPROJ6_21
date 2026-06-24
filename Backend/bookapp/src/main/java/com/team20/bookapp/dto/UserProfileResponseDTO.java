package com.team20.bookapp.dto;

import com.team20.bookapp.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileResponseDTO {
    private Long userId;
    private String name;
    private String email;

    private String token;

    // 내가 작성한 리뷰 요약 목록
    private List<MyReviewInfo> myReviews;
    // 내가 좋아요 한 도서 요약 목록
    private List<LikedBookInfo> myLikedBooks;

    public static UserProfileResponseDTO from(User user, String token) {
        return UserProfileResponseDTO.builder()
                .userId(user.getUid())
                .name(user.getName())
                .email(user.getEmail())
                .myReviews(user.getReviews().stream().map(r -> new MyReviewInfo(
                        r.getRid(),
                        r.getBook().getBid(),
                        r.getBook().getTitle(),
                        r.getContent()
                )).collect(Collectors.toList()))
                .myLikedBooks(user.getBookLikes().stream().map(bl -> new LikedBookInfo(
                        bl.getBook().getBid(),
                        bl.getBook().getTitle(),
                        bl.getBook().getCoverImageUrl()
                )).collect(Collectors.toList()))
                .token(token)
                .build();
    }

    @Getter @AllArgsConstructor
    public static class MyReviewInfo {
        private Long reviewId;
        private Long bookId;
        private String bookTitle;
        private String content;
    }

    @Getter @AllArgsConstructor
    public static class LikedBookInfo {
        private Long bookId;
        private String bookTitle;
        private String coverImageUrl;
    }
}