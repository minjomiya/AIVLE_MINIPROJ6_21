package com.team20.bookapp.controller;

import com.team20.bookapp.common.ApiResponse;
import com.team20.bookapp.dto.BookDTO;
import com.team20.bookapp.service.BookService;
import com.team20.bookapp.service.GenreService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final GenreService genreService;

    // =====================================================================
    // CRUD 기능
    // =====================================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookDTO>>> getAll(HttpServletRequest request) {

        Long uid = (Long) request.getAttribute("authenticatedUid");

        List<BookDTO> books = bookService.findAll(uid);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 목록 조회 성공", books)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookDTO>> getBook(
            @PathVariable("id") Long id,
            HttpServletRequest request) {

        Long uid = (Long) request.getAttribute("authenticatedUid");

        BookDTO book = bookService.findById(id, uid);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 상세 조회 성공", book)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 삭제 성공", null)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookDTO>> createBook(@Valid @RequestBody BookDTO bookDto) {
        BookDTO saved = bookService.create(bookDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>("success", "도서 등록 성공", saved)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<BookDTO>> updateBook(
            @PathVariable Long id,
            @RequestBody BookDTO bookDto
    ) {
        BookDTO updated = bookService.update(id, bookDto);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 수정 성공", updated)
        );
    }

    @PatchMapping("/{id}/cover")
    public ResponseEntity<ApiResponse<BookDTO>> updateCoverImage(
            @PathVariable Long id,
            @RequestBody BookDTO bookDto
    ) {
        BookDTO updated = bookService.update(id, bookDto);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 표지 이미지 수정 성공", updated)
        );
    }

    // =====================================================================
    // 검색 기능
    // =====================================================================

    @GetMapping("/search/title")
    public ResponseEntity<ApiResponse<List<BookDTO>>> searchByTitle(@RequestParam String title) {
        List<BookDTO> books = bookService.searchByTitle(title);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 제목 검색 성공", books)
        );
    }

    @GetMapping("/search/author")
    public ResponseEntity<ApiResponse<List<BookDTO>>> searchByAuthor(@RequestParam String author) {
        List<BookDTO> books = bookService.searchByAuthor(author);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 저자 검색 성공", books)
        );
    }

    @GetMapping("/search/title-keyword")
    public ResponseEntity<ApiResponse<List<BookDTO>>> searchByTitleKeyword(@RequestParam String keyword) {
        List<BookDTO> books = bookService.searchByTitleKeyword(keyword);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 제목 키워드 검색 성공", books)
        );
    }

    @GetMapping("/search/author-keyword")
    public ResponseEntity<ApiResponse<List<BookDTO>>> searchByAuthorKeyword(@RequestParam String keyword) {
        List<BookDTO> books = bookService.searchByAuthorKeyword(keyword);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 저자 키워드 검색 성공", books)
        );
    }

    @GetMapping("/search/detail")
    public ResponseEntity<ApiResponse<List<BookDTO>>> searchByTitleAndAuthor(
            @RequestParam String title,
            @RequestParam String author
    ) {
        List<BookDTO> books = bookService.searchByTitleAndAuthor(title, author);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 상세 검색 성공", books)
        );
    }

    // 카테고리 필터링
    @GetMapping("/search/category")
    public ResponseEntity<ApiResponse<List<BookDTO>>> searchByCategory(
            @RequestParam(required = false) String mainTag,
            @RequestParam(required = false) String subTag
    ) {
        List<BookDTO> books = genreService.searchByFilter(mainTag, subTag);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 카테고리 검색 성공", books)
        );
    }

    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<BookDTO>>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        Page<BookDTO> books = bookService.getPage(page, size, sortBy);

        return ResponseEntity.ok(
                new ApiResponse<>("success", "도서 페이지 조회 성공", books)
        );
    }
}