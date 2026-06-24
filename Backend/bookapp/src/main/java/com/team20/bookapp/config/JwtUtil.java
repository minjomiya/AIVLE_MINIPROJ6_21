package com.team20.bookapp.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.security.SecureRandom;

@Component
public class JwtUtil {
    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 토큰 유효 시간: 1시간
    private final long tokenValidityInMilliseconds = 3600000;

    /** 로그인 성공 시 uid를 넣어서 토큰 구워내기 */
    public String createToken(Long uid) {
        Claims claims = Jwts.claims().setSubject(String.valueOf(uid));
        Date now = new Date();
        Date validity = new Date(now.getTime() + tokenValidityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /** 들어온 토큰이 유효한지 검증 */
    public Long getUidFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return Long.parseLong(claims.getSubject());
        } catch (Exception e) {
            // 토큰이 위조되었거나 만료되면 null 반환
            return null;
        }
    }
}