package backend.config.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import backend.security.JwtAuthFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // =================================================
            // CORS
            // =================================================

            .cors(cors ->
                cors.configurationSource(
                    corsConfigurationSource()
                )
            )

            // =================================================
            // CSRF
            // =================================================

            .csrf(csrf ->
                csrf.disable()
            )

            // =================================================
            // SESSION
            // =================================================

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // =================================================
            // AUTHORIZATION
            // =================================================

            .authorizeHttpRequests(auth -> auth

                // -------------------------------------------------
                // CORS PREFLIGHT
                // -------------------------------------------------

                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // -------------------------------------------------
                // ROOT / ERROR
                // -------------------------------------------------

                .requestMatchers(
                    "/",
                    "/error"
                ).permitAll()

                // -------------------------------------------------
                // AUTHENTICATION
                // -------------------------------------------------

                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // -------------------------------------------------
                // PUBLIC APIs
                // -------------------------------------------------

                .requestMatchers(
                    "/api/public/**"
                ).permitAll()

                // -------------------------------------------------
                // HEALTH
                // -------------------------------------------------

                .requestMatchers(
                    "/health",
                    "/api/health"
                ).permitAll()

                // -------------------------------------------------
                // EVERYTHING ELSE
                // -------------------------------------------------

                .anyRequest().authenticated()
            )

            // =================================================
            // JWT AUTHENTICATION FILTER
            // =================================================

            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }


    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
            new CorsConfiguration();

        // -------------------------------------------------
        // FRONTEND ORIGINS
        // -------------------------------------------------

        configuration.setAllowedOrigins(
            List.of(
                // Local development
                "http://localhost:5173",

                // Render frontend
                "https://submys-lms-frontend.onrender.com"
            )
        );

        // -------------------------------------------------
        // HTTP METHODS
        // -------------------------------------------------

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
            )
        );

        // -------------------------------------------------
        // REQUEST HEADERS
        // -------------------------------------------------

        configuration.setAllowedHeaders(
            List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With"
            )
        );

        // -------------------------------------------------
        // RESPONSE HEADERS
        // -------------------------------------------------

        configuration.setExposedHeaders(
            List.of(
                "Authorization"
            )
        );

        // -------------------------------------------------
        // CREDENTIALS
        // -------------------------------------------------

        configuration.setAllowCredentials(true);

        // -------------------------------------------------
        // PREFLIGHT CACHE
        // -------------------------------------------------

        configuration.setMaxAge(3600L);

        // -------------------------------------------------
        // APPLY CORS TO ALL ENDPOINTS
        // -------------------------------------------------

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }


    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =====================================================
    // AUTHENTICATION MANAGER
    // =====================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
}