package com.mahesh.login_auth_api.util;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email) {

    return Jwts.builder()
            .subject(email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith((SecretKey) getSigningKey())
            .compact();

}

public String extractEmail(String token) {

    return Jwts.parser()
            .verifyWith((SecretKey) getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();

}

public boolean validateToken(String token, String email) {

    String extractedEmail = extractEmail(token);

    return extractedEmail.equals(email);

}

}