package backend.security;

import backend.entity.User;
import backend.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserRepository userRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public JwtAuthFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {

        this.jwtService = jwtService;

        this.userRepository = userRepository;
    }


    // =====================================================
    // JWT FILTER
    // =====================================================

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        System.out.println();
        System.out.println("======================================");
        System.out.println("          JWT AUTH FILTER");
        System.out.println("======================================");

        System.out.println(
                "Request: "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );


        // =================================================
        // GET AUTHORIZATION HEADER
        // =================================================

        String authHeader =
                request.getHeader("Authorization");


        System.out.println(
                "Authorization Header Present: "
                        + (authHeader != null)
        );


        // =================================================
        // NO TOKEN
        // =================================================

        if (
                authHeader == null
                        ||
                !authHeader.startsWith("Bearer ")
        ) {

            System.out.println(
                    "No Bearer JWT token found."
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =================================================
        // EXTRACT TOKEN
        // =================================================

        String token =
                authHeader.substring(7).trim();


        if (token.isEmpty()) {

            System.out.println(
                    "JWT token is empty."
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        try {

            // =================================================
            // EXTRACT EMAIL
            // =================================================

            String email =
                    jwtService.extractEmail(token);


            System.out.println(
                    "Email from JWT: "
                            + email
            );


            if (email == null || email.isBlank()) {

                System.out.println(
                        "JWT does not contain a valid email."
                );

                SecurityContextHolder
                        .clearContext();

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // =================================================
            // CHECK EXISTING AUTHENTICATION
            // =================================================

            if (
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            != null
            ) {

                System.out.println(
                        "Authentication already exists."
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // =================================================
            // VALIDATE TOKEN
            // =================================================

            boolean validToken =
                    jwtService.isTokenValid(token);


            System.out.println(
                    "JWT Valid: "
                            + validToken
            );


            if (!validToken) {

                System.out.println(
                        "JWT is invalid or expired."
                );

                SecurityContextHolder
                        .clearContext();

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // =================================================
            // FIND USER
            // =================================================

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);


            if (user == null) {

                System.out.println(
                        "User not found for email: "
                                + email
                );

                SecurityContextHolder
                        .clearContext();

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            System.out.println(
                    "User Found: "
                            + user.getEmail()
            );


            // =================================================
            // CHECK ROLE
            // =================================================

            if (user.getRole() == null) {

                System.out.println(
                        "ERROR: User role is NULL."
                );

                SecurityContextHolder
                        .clearContext();

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            System.out.println(
                    "User Role: "
                            + user.getRole()
            );


            // =================================================
            // CREATE ROLE AUTHORITY
            // =================================================

            String role =
                    user.getRole()
                            .name()
                            .toUpperCase();


            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            "ROLE_" + role
                    );


            System.out.println(
                    "Granted Authority: "
                            + authority.getAuthority()
            );


            // =================================================
            // CREATE AUTHENTICATION
            // =================================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            null,
                            List.of(authority)
                    );


            // =================================================
            // SET SECURITY CONTEXT
            // =================================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );


            // =================================================
            // VERIFY AUTHENTICATION
            // =================================================

            System.out.println(
                    "Authentication Created: "
                            + SecurityContextHolder
                            .getContext()
                            .getAuthentication()
            );


            System.out.println(
                    "Authorities: "
                            + SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            .getAuthorities()
            );


            System.out.println(
                    "JWT AUTHENTICATION SUCCESS."
            );


        } catch (Exception exception) {

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "JWT AUTHENTICATION ERROR"
            );

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "Error: "
                            + exception.getMessage()
            );


            exception.printStackTrace();


            SecurityContextHolder
                    .clearContext();
        }


        // =================================================
        // CONTINUE REQUEST
        // =================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}