package com.team20.bookapp.repository;

import com.team20.bookapp.domain.BookLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookLikeRepository extends JpaRepository<BookLike, Long> {
    Optional<BookLike> findByUserUidAndBookBid(Long uid, Long bid);
}
