package com.team20.bookapp.service;

import com.team20.bookapp.domain.Book;
import com.team20.bookapp.domain.BookTagMap;
import com.team20.bookapp.domain.Genre;
import com.team20.bookapp.dto.BookDTO;
import com.team20.bookapp.exception.BookNotFoundException;
import com.team20.bookapp.repository.BookRepository;
import com.team20.bookapp.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Lombok 생성자 주입 (final 필드)
public class BookService {

    private final BookRepository bookRepository;
    private final GenreRepository genreRepository;
    // ===== 조회 (readOnly = true → 변경 감지 생략, 성능 향상) =====
    // Repository는 Book 엔티티를 돌려주므로, 바깥으로 내보내기 전에
    // BookDTO.from(...) 으로 변환해서 반환한다.

    /** ID로 특정 책 조회 (없으면 404 변환용 예외) */
    @Transactional(readOnly = true)
    public BookDTO findById(Long bid) {
        Book book = bookRepository.findById(bid)
                .orElseThrow(() -> new BookNotFoundException("해당 도서를 찾을 수 없습니다. id=" + bid));
        return BookDTO.from(book);
    }

    /** 전체 책 목록 조회 */
    @Transactional(readOnly = true)
    public List<BookDTO> findAll() {
        return bookRepository.findAll().stream()
                .map(BookDTO::from)
                .collect(Collectors.toList());
    }

    /** 특정 책 삭제 */
    @Transactional
    public void deleteBook(Long bid) {
        Book book = bookRepository.findById(bid)
                .orElseThrow(() -> new BookNotFoundException("삭제할 도서를 찾을 수 없습니다. id=" + bid));
        bookRepository.delete(book);
    }

    // ===== 검색 =====

    /** 제목 완전 일치 검색 */
    @Transactional(readOnly = true)
    public List<BookDTO> searchByTitle(String title) {
        return bookRepository.findByTitle(title).stream()
                .map(BookDTO::from)
                .collect(Collectors.toList());
    }

    /** 저자 완전 일치 검색 */
    @Transactional(readOnly = true)
    public List<BookDTO> searchByAuthor(String author) {
        return bookRepository.findByAuthor(author).stream()
                .map(BookDTO::from)
                .collect(Collectors.toList());
    }

    /** 제목 키워드 포함 검색 */
    @Transactional(readOnly = true)
    public List<BookDTO> searchByTitleKeyword(String keyword) {
        return bookRepository.findByTitleContaining(keyword).stream()
                .map(BookDTO::from)
                .collect(Collectors.toList());
    }

    /** 저자 키워드 포함 검색 */
    @Transactional(readOnly = true)
    public List<BookDTO> searchByAuthorKeyword(String keyword) {
        return bookRepository.findByAuthorContaining(keyword).stream()
                .map(BookDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * 제목 + 저자 동시 검색
     * ※ BookRepository에 아래 메서드 추가 필요:
     *    List<Book> findByTitleContainingAndAuthorContaining(String title, String author);
     */
    @Transactional(readOnly = true)
    public List<BookDTO> searchByTitleAndAuthor(String title, String author) {
        return bookRepository.findByTitleContainingOrAuthorContaining(title, author).stream()
                .map(BookDTO::from)
                .collect(Collectors.toList());
    }

    /** 페이지네이션 조회 (sortBy 기준 내림차순) */
    @Transactional(readOnly = true)
    public Page<BookDTO> getPage(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        // Page.map() 으로 내용물만 BookDTO로 변환 (페이지 메타정보는 유지)
        return bookRepository.findAll(pageable).map(BookDTO::from);
    }

    // ===== 등록 / 수정 / 삭제 (CUD → 쓰기 트랜잭션) =====
    // @Transactional은 RuntimeException 발생 시 자동 ROLLBACK 됨.

    /** 새 책 등록 (createdAt/updatedAt은 Entity의 Auditing이 자동 처리) 장르 없을 시 해당 장르 추가 */
    /** 새 책 등록 (버그 완치 버전) */
    @Transactional
    public BookDTO create(BookDTO bookDto) {
        Book book = new Book(
                bookDto.getTitle(),
                bookDto.getAuthor(),
                bookDto.getContent(),
                bookDto.getCoverImageUrl()
        );

        // 등록 전에 매핑 리스트 clear
        book.clearBookTagMaps();

        for (BookDTO.GenreInfo genreInfo : bookDto.getGenres()) {
            Genre genre = genreRepository.findByMainTag(genreInfo.getMainTag())
                    .orElseGet(() -> {
                        Genre newGenre = new Genre();
                        newGenre.setMainTag(genreInfo.getMainTag());
                        newGenre.getSubTag().add(genreInfo.getSubTag());
                        return genreRepository.save(newGenre);
                    });

            // 중복 검사 로직
            if (!genre.getSubTag().contains(genreInfo.getSubTag())) {
                genre.getSubTag().add(genreInfo.getSubTag());
            }

            // 중복 매핑 검사 기준을 '대분류+소분류' 세트가 완전히 같은 경우로 변경
            boolean isAlreadyMapped = book.getBookTagMaps().stream()
                    .anyMatch(btm -> btm.getGenre().getGid().equals(genre.getGid())&& btm.getSubTag().equals(genreInfo.getSubTag()));

            if (!isAlreadyMapped) {
                // BookTagMap 내부에 subTag 추가로 인한 변경
                // 다이렉트 add 대신 연관 method 사용
                BookTagMap bookTagMap = new BookTagMap(book, genre, genreInfo.getSubTag());
                book.addBookTagMap(bookTagMap);
            }
        }

        Book saved = bookRepository.save(book);

        bookRepository.flush();

        return BookDTO.from(saved);
    }

    /**
     * 책 정보 부분 수정 (PATCH)
     * 요청에서 받은 필드 중 null이 아닌 값만 기존 도서에 반영.
     * 영속 상태 엔티티를 수정하므로 더티 체킹으로 자동 UPDATE → save() 불필요.
     */
    @Transactional
    public BookDTO update(Long id, BookDTO bookDto) {
        Book existing = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("수정할 도서를 찾을 수 없습니다. id=" + id));

        if (bookDto.getTitle() != null) {
            existing.setTitle(bookDto.getTitle());
        }

        if (bookDto.getAuthor() != null) {
            existing.setAuthor(bookDto.getAuthor());
        }

        if (bookDto.getContent() != null) {
            existing.setContent(bookDto.getContent());
        }

        if (bookDto.getCoverImageUrl() != null) {
            existing.setCoverImageUrl(bookDto.getCoverImageUrl());
        }
        /* 태그 수정 부분
        if (bookDto.getGenres() != null) {
            existing.getBookTagMaps().clear();

            for (BookDTO.GenreInfo genreInfo : bookDto.getGenres()) {
                Genre genre = genreRepository.findByMainTag(genreInfo.getGenreName())
                        .orElseGet(() -> {
                            Genre newGenre = new Genre();
                            newGenre.setMainTag(genreInfo.getGenreName());
                            newGenre.getSubTag().add(genreInfo.getTagName());
                            return genreRepository.save(newGenre);
                        });

                if (!genre.getSubTag().contains(genreInfo.getTagName())) {
                    genre.getSubTag().add(genreInfo.getTagName());
                }

                BookTagMap bookTagMap = new BookTagMap(existing, genre);
                existing.getBookTagMaps().add(bookTagMap);
            }
        }
         */

        return BookDTO.from(existing);
    }

}