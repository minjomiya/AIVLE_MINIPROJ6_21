package com.team20.bookapp.controller;

import com.team20.bookapp.service.ReviewAndLikeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class ReviewAndLikeController {

    private final ReviewAndLikeService reviewAndLikeService;

    /** 좋아요 API */
    @PostMapping("/{bid}/like")
    public ResponseEntity<String> toggleLike(
            @PathVariable("bid") Long bid,
            HttpServletRequest request) {
        Long authenticatedUid = (Long) request.getAttribute("authenticatedUid");

        reviewAndLikeService.toggleLike(authenticatedUid, bid);
        return ResponseEntity.ok("좋아요 상태 변경 완료!");
    }

    /** 도서 리뷰 등록 API */
    @PostMapping("/{bid}/reviews")
    public ResponseEntity<String> addReview(
            @PathVariable("bid") Long bid,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        Long authenticatedUid = (Long) request.getAttribute("authenticatedUid");
        String content = body.get("content");

        reviewAndLikeService.addReview(authenticatedUid, bid, content);
        return ResponseEntity.ok("리뷰가 성공적으로 등록되었습니다.");
    }

    /** 리뷰 삭제 API */
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable("reviewId") Long reviewId,
            HttpServletRequest request) {

        Long uid = (Long) request.getAttribute("authenticatedUid");

        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        reviewAndLikeService.deleteReview(uid, reviewId);

        return ResponseEntity.ok("리뷰가 성공적으로 삭제되었습니다.");
    }

    /** 리뷰 수정 API */
    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<String> updateReview(
            @PathVariable("reviewId") Long reviewId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        Long uid = (Long) request.getAttribute("authenticatedUid");

        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String content = body.get("content");

        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("수정할 내용을 입력해주세요.");
        }

        reviewAndLikeService.updateReview(uid, reviewId, content);

        return ResponseEntity.ok("리뷰가 성공적으로 수정되었습니다.");
    }
}