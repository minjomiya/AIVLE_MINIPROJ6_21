package com.team20.bookapp.repository;

import com.team20.bookapp.domain.Book;
import com.team20.bookapp.domain.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

    @Query("select distinct b from Book b " +
            "join b.bookTagMaps btm " +
            "join btm.genre g " +
            "where (:mainTag is null or g.mainTag = :mainTag) " +
            "and (:subTag is null or btm.subTag = :subTag)")
    List<Book> findByFilter(@Param("mainTag") String mainTag, @Param("subTag") String subTag);

    @Query("select g from Genre g join fetch g.subTag where g.mainTag = :mainTag")
    Optional<Genre> findByMainTag(@Param("mainTag") String mainTag);
}