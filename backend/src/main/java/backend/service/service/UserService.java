package backend.service;

import backend.dto.ChangePasswordRequest;
import backend.dto.UserProfileResponse;

import backend.entity.Role;
import backend.entity.User;

import backend.repository.AssignmentRepository;
import backend.repository.CourseRepository;
import backend.repository.QuizRepository;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private QuizRepository quizRepository;


    // =========================================================
    // GET ALL USERS
    // =========================================================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================================================
    // GET USER BY ID
    // =========================================================

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found with id: " + id
                        )
                );
    }


    // =========================================================
    // CREATE USER
    // =========================================================

    public User createUser(User user) {

        if (user.getPassword() != null
                && !user.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(
                            user.getPassword()
                    )
            );
        }

        if (user.getRole() == null) {

            user.setRole(Role.STUDENT);
        }

        return userRepository.save(user);
    }


    // =========================================================
    // UPDATE USER
    // =========================================================

    public User updateUser(
            Long id,
            User updatedUser
    ) {

        User existingUser = getUserById(id);

        Role existingRole = existingUser.getRole();

        if (updatedUser.getFullName() != null) {

            existingUser.setFullName(
                    updatedUser.getFullName()
            );
        }

        if (updatedUser.getEmail() != null) {

            existingUser.setEmail(
                    updatedUser.getEmail()
            );
        }

        // Keep the original role
        existingUser.setRole(existingRole);

        return userRepository.save(existingUser);
    }


    // =========================================================
    // GET USER PROFILE WITH ACTIVITY COUNTS
    // =========================================================

    public UserProfileResponse getUserProfile(Long id) {

        User user = getUserById(id);


        // -----------------------------------------------------
        // TOTAL COURSES
        // -----------------------------------------------------
        // Count all courses currently in the system.
        // -----------------------------------------------------

        long totalCourses =
                courseRepository.count();


        // -----------------------------------------------------
        // TOTAL STUDENTS
        // -----------------------------------------------------
        // Count all users whose role is STUDENT.
        // -----------------------------------------------------

        long totalStudents =
                userRepository.countByRole(
                        Role.STUDENT
                );


        // -----------------------------------------------------
        // TOTAL ASSIGNMENTS
        // -----------------------------------------------------

        long totalAssignments =
                assignmentRepository.count();


        // -----------------------------------------------------
        // TOTAL QUIZZES
        // -----------------------------------------------------

        long totalQuizzes =
                quizRepository.count();


        // -----------------------------------------------------
        // RETURN PROFILE
        // -----------------------------------------------------

        return new UserProfileResponse(

                user.getId(),

                user.getFullName(),

                user.getEmail(),

                user.getRole(),

                totalCourses,

                totalStudents,

                totalAssignments,

                totalQuizzes
        );
    }


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    public void changePassword(
            Long id,
            ChangePasswordRequest request
    ) {

        User user = getUserById(id);

        if (request == null) {

            throw new RuntimeException(
                    "Password request is required"
            );
        }

        if (request.getCurrentPassword() == null
                || request.getCurrentPassword().isBlank()) {

            throw new RuntimeException(
                    "Current password is required"
            );
        }

        if (request.getNewPassword() == null
                || request.getNewPassword().isBlank()) {

            throw new RuntimeException(
                    "New password is required"
            );
        }

        if (user.getPassword() == null
                || user.getPassword().isBlank()) {

            throw new RuntimeException(
                    "User password is not configured"
            );
        }

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        if (request.getNewPassword().length() < 6) {

            throw new RuntimeException(
                    "New password must be at least 6 characters"
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "New password must be different from current password"
            );
        }

        String encodedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );

        user.setPassword(encodedPassword);

        userRepository.save(user);
    }


    // =========================================================
    // GET USER BY EMAIL
    // =========================================================

    public User getUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found with email: " + email
                        )
                );
    }


    // =========================================================
    // GET USERS BY ROLE
    // =========================================================

    public List<User> getUsersByRole(Role role) {

        return userRepository.findByRole(role);
    }


    // =========================================================
    // SEARCH BY NAME
    // =========================================================

    public List<User> searchByName(String name) {

        return userRepository
                .findByFullNameContainingIgnoreCase(name);
    }


    // =========================================================
    // SEARCH BY EMAIL
    // =========================================================

    public List<User> searchByEmail(String email) {

        return userRepository
                .findByEmailContainingIgnoreCase(email);
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    public void deleteUser(Long id) {

        User user = getUserById(id);

        userRepository.delete(user);
    }
}