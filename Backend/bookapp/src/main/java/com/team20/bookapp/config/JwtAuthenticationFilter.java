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

        // 회원가입과 로그인은 토큰 없이도 무조건 통과
        if (path.startsWith("/users/signup") || path.startsWith("/users/login") || path.startsWith("/books") || httpRequest.getMethod().equals("OPTIONS")) {
            chain.doFilter(request, response);
            return;
        }

        // 헤더에서 Authorization 키값 확인
        String authHeader = httpRequest.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Long uid = jwtUtil.getUidFromToken(token);

            if (uid != null) {
                boolean userExists = userRepository.existsById(uid);

                if (userExists) {
                    httpRequest.setAttribute("authenticatedUid", uid);
                    chain.doFilter(request, response);
                    return;
                }
            }
        }

        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpResponse.setContentType("application/json;charset=UTF-8");
        httpResponse.getWriter().write("{\"status\": \"error\", \"message\": \"로그인이 필요하거나 만료된 토큰입니다.\"}");
    }
}