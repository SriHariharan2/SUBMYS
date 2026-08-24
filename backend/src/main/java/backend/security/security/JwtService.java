package backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    // =====================================================
    // JWT SECRET
    // =====================================================

    private static final String SECRET_KEY =
            "eduai-lms-super-secret-jwt-key-must-be-at-least-32-characters";


    // =====================================================
    // TOKEN EXPIRATION
    // =====================================================
    // 24 hours
    // =====================================================

    private static final long EXPIRATION_TIME =
            1000L * 60L * 60L * 24L;


    // =====================================================
    // SIGNING KEY
    // =====================================================

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(
                        StandardCharsets.UTF_8
                )
        );
    }


    // =====================================================
    // GENERATE TOKEN
    // =====================================================

    public String generateToken(
            String email
    ) {

        if (
                email == null ||
                email.isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Email cannot be empty"
            );
        }


        Date issuedAt =
                new Date();


        Date expiration =
                new Date(
                        System.currentTimeMillis()
                                + EXPIRATION_TIME
                );


        return Jwts.builder()

                // -----------------------------------------
                // SUBJECT
                // -----------------------------------------

                .subject(email)


                // -----------------------------------------
                // ISSUED TIME
                // -----------------------------------------

                .issuedAt(issuedAt)


                // -----------------------------------------
                // EXPIRATION
                // -----------------------------------------

                .expiration(expiration)


                // -----------------------------------------
                // SIGN
                // -----------------------------------------

                .signWith(
                        getSigningKey()
                )


                // -----------------------------------------
                // BUILD
                // -----------------------------------------

                .compact();
    }


    // =====================================================
    // EXTRACT EMAIL
    // =====================================================

    public String extractEmail(
            String token
    ) {

        if (
                token == null ||
                token.isBlank()
        ) {

            return null;
        }


        Claims claims =
                extractClaims(token);


        return claims.getSubject();
    }


    // =====================================================
    // CHECK TOKEN VALID
    // =====================================================

    public boolean isTokenValid(
            String token
    ) {

        try {

            if (
                    token == null ||
                    token.isBlank()
            ) {

                return false;
            }


            Claims claims =
                    extractClaims(token);


            Date expiration =
                    claims.getExpiration();


            if (expiration == null) {

                return false;
            }


            return expiration.after(
                    new Date()
            );

        } catch (Exception exception) {

            System.out.println(
                    "JWT validation failed: "
                            + exception.getMessage()
            );

            return false;
        }
    }


    // =====================================================
    // EXTRACT CLAIMS
    // =====================================================

    private Claims extractClaims(
            String token
    ) {

        return Jwts.parser()

                // -----------------------------------------
                // VERIFY SIGNATURE
                // -----------------------------------------

                .verifyWith(
                        getSigningKey()
                )

                // -----------------------------------------
                // BUILD PARSER
                // -----------------------------------------

                .build()

                // -----------------------------------------
                // PARSE SIGNED JWT
                // -----------------------------------------

                .parseSignedClaims(token)

                // -----------------------------------------
                // GET PAYLOAD
                // -----------------------------------------

                .getPayload();
    }
}