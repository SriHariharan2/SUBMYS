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

        // -----------------------------------------------------
        // CHECK PASSWORD
        // -----------------------------------------------------

        if (user.getPassword() == null
                || user.getPassword().isBlank()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }


        // -----------------------------------------------------
        // PASSWORD LENGTH
        // -----------------------------------------------------

        if (user.getPassword().length() < 6) {

            throw new RuntimeException(
                    "Password must be at least 6 characters"
            );
        }


        // -----------------------------------------------------
        // CHECK EMAIL
        // -----------------------------------------------------

        if (user.getEmail() == null
                || user.getEmail().isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        // -----------------------------------------------------
        // CHECK DUPLICATE EMAIL
        // -----------------------------------------------------

        if (userRepository.existsByEmail(user.getEmail())) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }


        // -----------------------------------------------------
        // DEFAULT ROLE
        // -----------------------------------------------------

        if (user.getRole() == null) {

            user.setRole(Role.STUDENT);
        }


        // -----------------------------------------------------
        // ENCODE PASSWORD WITH BCrypt
        // -----------------------------------------------------

        String encodedPassword =
                passwordEncoder.encode(
                        user.getPassword()
                );

        user.setPassword(encodedPassword);


        // -----------------------------------------------------
        // SAVE USER
        // -----------------------------------------------------

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


        // -----------------------------------------------------
        // UPDATE FULL NAME
        // -----------------------------------------------------

        if (updatedUser.getFullName() != null
                && !updatedUser.getFullName().isBlank()) {

            existingUser.setFullName(
                    updatedUser.getFullName()
            );
        }


        // -----------------------------------------------------
        // UPDATE EMAIL
        // -----------------------------------------------------

        if (updatedUser.getEmail() != null
                && !updatedUser.getEmail().isBlank()) {

            String newEmail =
                    updatedUser.getEmail().trim();

            // Check if another user already has this email
            if (!newEmail.equalsIgnoreCase(
                    existingUser.getEmail()
            )
                    && userRepository.existsByEmail(newEmail)) {

                throw new RuntimeException(
                        "Email already exists"
                );
            }

            existingUser.setEmail(newEmail);
        }


        // -----------------------------------------------------
        // UPDATE ROLE
        // -----------------------------------------------------

        if (updatedUser.getRole() != null) {

            existingUser.setRole(
                    updatedUser.getRole()
            );
        }


        // -----------------------------------------------------
        // PASSWORD
        // -----------------------------------------------------
        //
        // Only update password if a new password was provided.
        //
        // If password is blank:
        // keep the existing password.
        //
        // -----------------------------------------------------

        if (updatedUser.getPassword() != null
                && !updatedUser.getPassword().isBlank()) {

            if (updatedUser.getPassword().length() < 6) {

                throw new RuntimeException(
                        "Password must be at least 6 characters"
                );
            }

            String encodedPassword =
                    passwordEncoder.encode(
                            updatedUser.getPassword()
                    );

            existingUser.setPassword(
                    encodedPassword
            );
        }


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

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

        long totalCourses =
                courseRepository.count();


        // -----------------------------------------------------
        // TOTAL STUDENTS
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


        // -----------------------------------------------------
        // CHECK REQUEST
        // -----------------------------------------------------

        if (request == null) {

            throw new RuntimeException(
                    "Password request is required"
            );
        }


        // -----------------------------------------------------
        // CURRENT PASSWORD
        // -----------------------------------------------------

        if (request.getCurrentPassword() == null
                || request.getCurrentPassword().isBlank()) {

            throw new RuntimeException(
                    "Current password is required"
            );
        }


        // -----------------------------------------------------
        // NEW PASSWORD
        // -----------------------------------------------------

        if (request.getNewPassword() == null
                || request.getNewPassword().isBlank()) {

            throw new RuntimeException(
                    "New password is required"
            );
        }


        // -----------------------------------------------------
        // EXISTING PASSWORD
        // -----------------------------------------------------

        if (user.getPassword() == null
                || user.getPassword().isBlank()) {

            throw new RuntimeException(
                    "User password is not configured"
            );
        }


        // -----------------------------------------------------
        // VERIFY CURRENT PASSWORD
        // -----------------------------------------------------

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }


        // -----------------------------------------------------
        // PASSWORD LENGTH
        // -----------------------------------------------------

        if (request.getNewPassword().length() < 6) {

            throw new RuntimeException(
                    "New password must be at least 6 characters"
            );
        }


        // -----------------------------------------------------
        // SAME PASSWORD CHECK
        // -----------------------------------------------------

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "New password must be different from current password"
            );
        }


        // -----------------------------------------------------
        // ENCODE NEW PASSWORD
        // -----------------------------------------------------

        String encodedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );


        user.setPassword(
                encodedPassword
        );


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

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