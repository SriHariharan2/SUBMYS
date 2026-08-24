package backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @GetMapping("/dashboard")
    public Map<String, String> dashboard(Authentication authentication) {

        return Map.of(
                "message", "Welcome to the Student Dashboard",
                "email", authentication.getName()
        );
    }
}