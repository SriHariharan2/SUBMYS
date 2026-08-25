package backend.config;

import backend.security.JwtAuthFilter;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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


@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public SecurityConfig(
            JwtAuthFilter jwtAuthFilter
    ) {
        this.jwtAuthFilter = jwtAuthFilter;
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
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }


    // =====================================================
    // CORS
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // =================================================
                // CORS
                // =================================================

                .cors(cors -> {})


                // =================================================
                // CSRF
                // =================================================

                .csrf(
                        csrf -> csrf.disable()
                )


                // =================================================
                // STATELESS JWT
                // =================================================

                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS
                                )
                )


                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(
                        auth -> auth

                                // =================================
                                // PUBLIC
                                // =================================
                                // These endpoints can be accessed
                                // without a JWT token.
                                // =================================

                                .requestMatchers(
                                        "/",
                                        "/error",
                                        "/api/auth/**"
                                )
                                .permitAll()


                                // =================================
                                // COURSE PROGRESS
                                // =================================

                                .requestMatchers(
                                        "/api/course-progress/student/**"
                                )
                                .authenticated()

                                .requestMatchers(
                                        "/api/course-progress/**"
                                )
                                .authenticated()


                                // =================================
                                // USERS
                                // =================================

                                .requestMatchers(
                                        "/api/users/**"
                                )
                                .authenticated()


                                // =================================
                                // COURSES
                                // =================================

                                .requestMatchers(
                                        "/api/courses/**"
                                )
                                .authenticated()


                                // =================================
                                // SUBJECTS
                                // =================================

                                .requestMatchers(
                                        "/api/subjects/**"
                                )
                                .authenticated()


                                // =================================
                                // TOPICS
                                // =================================

                                .requestMatchers(
                                        "/api/topics/**"
                                )
                                .authenticated()


                                // =================================
                                // RESOURCES
                                // =================================

                                .requestMatchers(
                                        "/api/resources/**"
                                )
                                .authenticated()


                                // =================================
                                // ASSIGNMENTS
                                // =================================

                                .requestMatchers(
                                        "/api/assignments/**"
                                )
                                .authenticated()


                                // =================================
                                // ASSIGNMENT SUBMISSIONS
                                // =================================

                                .requestMatchers(
                                        "/api/assignment-submissions/**"
                                )
                                .authenticated()


                                // =================================
                                // QUIZZES
                                // =================================

                                .requestMatchers(
                                        "/api/quizzes/**"
                                )
                                .authenticated()


                                // =================================
                                // QUESTIONS
                                // =================================

                                .requestMatchers(
                                        "/api/questions/**"
                                )
                                .authenticated()


                                // =================================
                                // ENROLLMENTS
                                // =================================

                                .requestMatchers(
                                        "/api/enrollments/**"
                                )
                                .authenticated()


                                // =================================
                                // ANNOUNCEMENTS
                                // =================================

                                .requestMatchers(
                                        "/api/announcements/**"
                                )
                                .authenticated()


                                // =================================
                                // DISCUSSIONS
                                // =================================

                                .requestMatchers(
                                        "/api/discussions/**"
                                )
                                .authenticated()


                                // =================================
                                // REPLIES
                                // =================================

                                .requestMatchers(
                                        "/api/replies/**"
                                )
                                .authenticated()


                                // =================================
                                // CERTIFICATES
                                // =================================

                                .requestMatchers(
                                        "/api/certificates/**"
                                )
                                .authenticated()


                                // =================================
                                // GRADES
                                // =================================

                                .requestMatchers(
                                        "/api/grades/**"
                                )
                                .authenticated()


                                // =================================
                                // ATTENDANCE
                                // =================================

                                .requestMatchers(
                                        "/api/attendance/**"
                                )
                                .authenticated()


                                // =================================
                                // EVENTS
                                // =================================

                                .requestMatchers(
                                        "/api/events/**"
                                )
                                .authenticated()


                                // =================================
                                // REPORTS
                                // =================================

                                .requestMatchers(
                                        "/api/reports/**"
                                )
                                .authenticated()


                                // =================================
                                // NOTIFICATIONS
                                // =================================

                                .requestMatchers(
                                        "/api/notifications/**"
                                )
                                .authenticated()


                                // =================================
                                // AI
                                // =================================

                                .requestMatchers(
                                        "/api/ai/**"
                                )
                                .authenticated()


                                // =================================
                                // EVERYTHING ELSE
                                // =================================

                                .anyRequest()
                                .authenticated()
                )


                // =================================================
                // JWT FILTER
                // =================================================

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}