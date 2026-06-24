package com.team20.bookapp.exception;

public class EmailDuplicateException extends RuntimeException {
    public EmailDuplicateException(String message) {
        super(message);
    }
}
