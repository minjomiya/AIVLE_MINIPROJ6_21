package com.team20.bookapp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "book_tag_map")
@Getter @Setter
@NoArgsConstructor
public class BookTagMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 매핑 테이블의 기본키(PK)

    // 명세서의 bid (Book 테이블의 외래키)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bid", nullable = false)
    private Book book;

    // 명세서의 gid (Genre 테이블의 외래키)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gid", nullable = false)
    private Genre genre;

    @Column(nullable = false)
    private String subTag;

    public BookTagMap(Book book, Genre genre, String subTag) {
        this.book = book;
        this.genre = genre;
        this.subTag = subTag;
    }
}