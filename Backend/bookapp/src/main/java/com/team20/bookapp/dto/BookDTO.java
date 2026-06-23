/**
 * 프론트엔드에서 책 리스트를 띄우거나 상세 조회를 할 때 사용하는 DTO
 */

package com.team20.bookapp.dto;

import com.team20.bookapp.domain.Book;
import jakarta.validation.constraints.NotBlank; // 필수 import
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookDTO {
    private Long id;

    @NotBlank(message = "제목은 필수입니다.") // 필수값 검증 추가
    private String title;

    @NotBlank(message = "저자는 필수입니다.") // 필수값 검증 추가
    private String author;

    @NotBlank(message = "내용은 필수입니다.") // 필수값 검증 추가
    private String content;

    private String coverImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<GenreInfo> genres;

    // 오버로딩: 전체 조회/상세 조회
    public static BookDTO from(Book b){
        return from(b, null);
    }

    // 오버로딩: 장르에 따른 조회
    public static BookDTO from(Book b, String subTag){
        return BookDTO.builder()
                .id(b.getBid())
                .title(b.getTitle())
                .author(b.getAuthor())
                .content(b.getContent())
                .coverImageUrl(b.getCoverImageUrl())
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .genres(b.getBookTagMaps() == null ? List.of() : b.getBookTagMaps().stream()
                        .filter(btm -> subTag == null || btm.getSubTag().equals(subTag))
                        .map(btm -> GenreInfo.builder()
                                .mainTag(btm.getGenre().getMainTag())
                                .subTag(btm.getSubTag())    // BookTagMap field에서 바로 꺼내오도록 변경
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    /**
     ** 내부 장르 정보 클래스
     **/
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class GenreInfo {
        private String mainTag; // 대분류
        private String subTag;   // 소분류
    }
}
