package com.team20.bookapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordUpdateDto {
    private String currentPassword; // 현재 비밀번호
    private String newPassword;     // 바꿀 새 비밀번호
}