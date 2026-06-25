package com.team20.bookapp.service;

import com.team20.bookapp.dto.BookDTO;
import com.team20.bookapp.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreService {

    private final GenreRepository genreRepository;

    /**
     * 장르(대분류) / 태그(소분류) 필터로 책 조회.
     * - 둘 다 비어 있으면 → '전체'로 판단해 모든 책 반환
     * - mainTag만 있으면 → 해당 대분류 장르의 책
     * - mainTag + subTag → 대분류 + 소분류 서브태그 조건에 맞는 책
     * 실제 분기(동적 쿼리)는 GenreRepository.findByFilter 안에서 처리.
     */
    @Transactional(readOnly = true)
    public List<BookDTO> searchByFilter(String mainTag, String subTag) {
        String targetMain = StringUtils.hasText(mainTag) ? mainTag : null;
        String targetSub  = StringUtils.hasText(subTag)  ? subTag  : null;

        // BookDTO 오버로딩 메서드 파라미터 변경으로 인한 리팩토링
        return genreRepository.findByFilter(targetMain, targetSub).stream()
                .map(book -> BookDTO.from(book, targetSub, false))
                .collect(Collectors.toList());
    }
}