/*
   Webconfig.java
   - CORS 설정
 */

package com.team20.bookapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")      // 모든 경로(e.g., `/api/books`)에 이 CORS 규칙을 적용
                .allowedOrigins("http://localhost:5173")       // 요청을 허용할 '방문자 명단’에React 앱 주소(`:5173`)를 등록
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")     //React 앱이 서버에 요청할 수 있는 method 허용
                .allowedHeaders("*")        // 모든 HTTP 헤더 포함 허용
                .allowCredentials(true)     // (옵션) 로그인 구현 시 인증 전보 전달 허용
                .maxAge(3600);
    }
}
