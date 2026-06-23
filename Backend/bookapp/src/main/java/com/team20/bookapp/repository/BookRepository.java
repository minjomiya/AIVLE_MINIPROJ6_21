package com.team20.bookapp.repository;

import com.team20.bookapp.domain.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    @EntityGraph(attributePaths = {"bookTagMaps", "bookTagMaps.genre"})
    @Query("select b from Book b")
    List<Book> findAllWithGenres();

    @EntityGraph(attributePaths = {"bookTagMaps", "bookTagMaps.genre"})
    List<Book> findByTitle(String title);

    @EntityGraph(attributePaths = {"bookTagMaps", "bookTagMaps.genre"})
    List<Book> findByAuthor(String author);

    @EntityGraph(attributePaths = {"bookTagMaps", "bookTagMaps.genre"})
    List<Book> findByTitleContaining(String keyword);

    @EntityGraph(attributePaths = {"bookTagMaps", "bookTagMaps.genre"})
    List<Book> findByAuthorContaining(String keyword);

    @EntityGraph(attributePaths = {"bookTagMaps", "bookTagMaps.genre"})
    List<Book> findByTitleContainingOrAuthorContaining(String title, String author);
}