package com.team20.bookapp.config;

import com.team20.bookapp.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements Filter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();

        if ("OPTIONS".equals(method)) {
            chain.doFilter(request, response);
            return;
        }

        // 일단 토큰 확인부터
        String authHeader = httpRequest.getHeader("Authorization");
        boolean isTokenValid = false;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Long uid = jwtUtil.getUidFromToken(token);
                if (uid != null && userRepository.existsById(uid)) {
                    httpRequest.setAttribute("authenticatedUid", uid);
                    isTokenValid = true;
                }
            } catch (Exception e) {
                System.out.println("토큰 파싱 예외 발생: " + e.getMessage());
            }
        }

        // 로그인 필요 없는 거
        if (path.startsWith("/users/signup") || path.startsWith("/users/login") || path.endsWith("/books")) {
            chain.doFilter(request, response);
            return;
        }

        // 에러처리
        if (!isTokenValid) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.setContentType("application/json;charset=UTF-8");
            httpResponse.getWriter().write("{\"status\": \"error\", \"message\": \"로그인이 필요하거나 만료된 토큰입니다.\"}");
            return;
        }

        chain.doFilter(request, response);
    }
}