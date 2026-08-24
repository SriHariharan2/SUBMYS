package backend.controller;

import backend.dto.ChangePasswordRequest;
import backend.dto.UserProfileResponse;

import backend.entity.Role;
import backend.entity.User;

import backend.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }


    // =========================================================
    // GET USER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public User getUserById(
            @PathVariable Long id
    ) {

        return userService.getUserById(id);
    }


    // =========================================================
    // GET USER PROFILE WITH ACTIVITY
    // =========================================================

    @GetMapping("/{id}/profile")
    public UserProfileResponse getUserProfile(
            @PathVariable Long id
    ) {

        return userService.getUserProfile(id);
    }


    // =========================================================
    // CREATE USER
    // =========================================================

    @PostMapping
    public User createUser(
            @RequestBody User user
    ) {

        return userService.createUser(user);
    }


    // =========================================================
    // UPDATE USER
    // =========================================================

    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User user
    ) {

        return userService.updateUser(
                id,
                user
        );
    }


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    @PutMapping("/{id}/change-password")
    public String changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request
    ) {

        userService.changePassword(
                id,
                request
        );

        return "Password changed successfully.";
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id
    ) {

        userService.deleteUser(id);

        return "User deleted successfully.";
    }


    // =========================================================
    // GET USER BY EMAIL
    // =========================================================

    @GetMapping("/email/{email}")
    public User getUserByEmail(
            @PathVariable String email
    ) {

        return userService.getUserByEmail(email);
    }


    // =========================================================
    // GET USERS BY ROLE
    // =========================================================

    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(
            @PathVariable Role role
    ) {

        return userService.getUsersByRole(role);
    }


    // =========================================================
    // SEARCH BY NAME
    // =========================================================

    @GetMapping("/search/name/{name}")
    public List<User> searchByName(
            @PathVariable String name
    ) {

        return userService.searchByName(name);
    }


    // =========================================================
    // SEARCH BY EMAIL
    // =========================================================

    @GetMapping("/search/email/{email}")
    public List<User> searchByEmail(
            @PathVariable String email
    ) {

        return userService.searchByEmail(email);
    }
}