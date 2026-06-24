package com.team20.bookapp.controller;

import com.team20.bookapp.service.ReviewAndLikeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
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
        Long uid = (Long) request.getAttribute("authenticatedUid");

        reviewAndLikeService.toggleLike(uid, bid);
        return ResponseEntity.ok("좋아요 상태 변경 완료!");
    }

    /** 도서 리뷰 등록 API */
    @PostMapping("/{bid}/reviews")
    public ResponseEntity<String> addReview(
            @PathVariable("bid") Long bid,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        Long uid = (Long) request.getAttribute("authenticatedUid");
        String content = body.get("content");

        reviewAndLikeService.addReview(uid, bid, content);
        return ResponseEntity.ok("리뷰가 성공적으로 등록되었습니다.");
    }
}