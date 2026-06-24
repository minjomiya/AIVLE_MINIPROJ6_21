package com.team20.bookapp.service;

import com.team20.bookapp.domain.Book;
import com.team20.bookapp.domain.BookLike;
import com.team20.bookapp.domain.Review;
import com.team20.bookapp.domain.User;
import com.team20.bookapp.repository.BookLikeRepository;
import com.team20.bookapp.repository.BookRepository;
import com.team20.bookapp.repository.ReviewRepository;
import com.team20.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewAndLikeService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    private final BookLikeRepository bookLikeRepository;

    /** 리뷰 작성 */
    @Transactional
    public void addReview(Long uid, Long bid, String content) {
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Book book = bookRepository.findById(bid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 도서입니다."));

        Review review = new Review();
        review.setUser(user);
        review.setBook(book);
        review.setContent(content);
        review.setCreatedAt(java.time.LocalDateTime.now());

        reviewRepository.save(review);
    }

    /** 좋아요 */
    @Transactional
    public void toggleLike(Long uid, Long bid) {
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Book book = bookRepository.findById(bid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 도서입니다."));

        // 이미 좋아요를 눌렀는지 확인
        bookLikeRepository.findByUserUidAndBookBid(uid, bid)
                .ifPresentOrElse(
                        bookLikeRepository::delete,
                        () -> {
                            BookLike bookLike = new BookLike();
                            bookLike.setUser(user);
                            bookLike.setBook(book);
                            bookLikeRepository.save(bookLike);
                        }
                );
    }
}