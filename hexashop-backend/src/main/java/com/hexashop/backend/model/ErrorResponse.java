package com.hexashop.backend.model;

public record ErrorResponse(boolean error, String message, String details) {}
