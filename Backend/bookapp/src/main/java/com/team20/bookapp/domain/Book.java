package com.team20.bookapp.domain;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bid;

    @Column(nullable = false, length = 30)
    @NotBlank
    private String title;

    @Column(nullable = false, length = 20)
    @NotBlank
    private String author;

    @Column(nullable = false, length = 400)
    @NotBlank
    private String content;

    @Column(columnDefinition = "TEXT")
    private String coverImageUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookTagMap> bookTagMaps = new ArrayList<>();

    public Book(String title, String author, String content, String coverImageUrl) {
        this.title = title;
        this.author = author;
        this.content = content;
        this.coverImageUrl = coverImageUrl;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 책-장르 매핑 양방향 싱크 메서드
    public void addBookTagMap(BookTagMap bookTagMap) {
        this.bookTagMaps.add(bookTagMap);
        if (bookTagMap.getBook() != this) {
            bookTagMap.setBook(this);
        }
    }

    // 기존 매핑 리스트 청소 메서드
    public void clearBookTagMaps() {
        if (this.bookTagMaps != null) {
            this.bookTagMaps.clear();
        }
    }

}
