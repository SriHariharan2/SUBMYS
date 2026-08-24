package backend.service;

import backend.dto.DiscussionResponse;
import backend.entity.Course;
import backend.entity.CourseChatSetting;
import backend.entity.DiscussionPost;
import backend.entity.User;
import backend.repository.CourseChatSettingRepository;
import backend.repository.CourseRepository;
import backend.repository.DiscussionPostRepository;
import backend.repository.EnrollmentRepository;
import backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscussionPostService {

    private final DiscussionPostRepository discussionPostRepository;

    private final CourseRepository courseRepository;

    private final UserRepository userRepository;

    private final EnrollmentRepository enrollmentRepository;

    private final CourseChatSettingRepository
            courseChatSettingRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DiscussionPostService(
            DiscussionPostRepository discussionPostRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            CourseChatSettingRepository courseChatSettingRepository
    ) {

        this.discussionPostRepository =
                discussionPostRepository;

        this.courseRepository =
                courseRepository;

        this.userRepository =
                userRepository;

        this.enrollmentRepository =
                enrollmentRepository;

        this.courseChatSettingRepository =
                courseChatSettingRepository;
    }


    // =====================================================
    // CURRENT USER
    // =====================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (
                authentication == null ||
                !authentication.isAuthenticated()
        ) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        String email =
                authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found."
                        )
                );
    }


    // =====================================================
    // GET CHAT SETTING
    // =====================================================

    @Transactional
    public boolean isChatEnabled(
            Long courseId
    ) {

        Course course =
                courseRepository
                        .findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found."
                                )
                        );

        return courseChatSettingRepository
                .findByCourseId(courseId)
                .map(
                        CourseChatSetting::isEnabled
                )
                .orElse(true);
    }


    // =====================================================
    // GET OR CREATE CHAT SETTING
    // =====================================================

    @Transactional
    private CourseChatSetting
    getOrCreateChatSetting(
            Course course
    ) {

        return courseChatSettingRepository
                .findByCourseId(course.getId())
                .orElseGet(() -> {

                    CourseChatSetting setting =
                            new CourseChatSetting();

                    setting.setCourse(course);

                    setting.setEnabled(true);

                    return courseChatSettingRepository
                            .save(setting);
                });
    }


    // =====================================================
    // CHECK ADMIN
    // =====================================================

    private boolean isAdmin(
            User user
    ) {

        return user != null
                && user.getRole() != null
                && "ADMIN".equals(
                        user.getRole()
                                .name()
                                .toUpperCase()
                );
    }


    // =====================================================
    // CHECK TEACHER
    // =====================================================

    private boolean isTeacher(
            User user
    ) {

        return user != null
                && user.getRole() != null
                && "TEACHER".equals(
                        user.getRole()
                                .name()
                                .toUpperCase()
                );
    }


    // =====================================================
    // CHECK STUDENT
    // =====================================================

    private boolean isStudent(
            User user
    ) {

        return user != null
                && user.getRole() != null
                && "STUDENT".equals(
                        user.getRole()
                                .name()
                                .toUpperCase()
                );
    }


    // =====================================================
    // CHECK TEACHER OWNS COURSE
    // =====================================================

    private boolean isCourseTeacher(
            User user,
            Course course
    ) {

        if (!isTeacher(user)) {
            return false;
        }

        if (course.getInstructor() == null) {
            return false;
        }

        if (course.getInstructor().getId() == null) {
            return false;
        }

        return course.getInstructor()
                .getId()
                .equals(user.getId());
    }


    // =====================================================
    // CHECK STUDENT ENROLLMENT
    // =====================================================

    private boolean isStudentEnrolled(
            Long studentId,
            Long courseId
    ) {

        return enrollmentRepository
                .findByStudentIdAndCourseId(
                        studentId,
                        courseId
                )
                .isPresent();
    }


    // =====================================================
    // CHECK COURSE CHAT ACCESS
    // =====================================================

    private void checkCourseAccess(
            Long courseId,
            User user
    ) {

        if (user == null) {

            throw new RuntimeException(
                    "User not found."
            );
        }

        Course course =
                courseRepository
                        .findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found."
                                )
                        );

        // ADMIN
        if (isAdmin(user)) {
            return;
        }

        // TEACHER
        if (isCourseTeacher(
                user,
                course
        )) {
            return;
        }

        // STUDENT
        if (isStudent(user)) {

            if (
                    isStudentEnrolled(
                            user.getId(),
                            courseId
                    )
            ) {
                return;
            }

            throw new RuntimeException(
                    "You are not enrolled in this course."
            );
        }

        throw new RuntimeException(
                "You are not allowed to access this course chat."
        );
    }


    // =====================================================
    // CHECK CHAT ENABLED
    // =====================================================

    private void checkChatEnabled(
            Long courseId
    ) {

        boolean enabled =
                isChatEnabled(courseId);

        if (!enabled) {

            throw new RuntimeException(
                    "Discussion chat is currently disabled for this course."
            );
        }
    }


    // =====================================================
    // CREATE DISCUSSION MESSAGE
    // =====================================================

    @Transactional
    public DiscussionPost createPost(
            Long courseId,
            Long userId,
            DiscussionPost discussionPost
    ) {

        User currentUser =
                getCurrentUser();

        // The logged-in user must match
        // the userId sent by frontend.
        if (
                !currentUser
                        .getId()
                        .equals(userId)
        ) {

            throw new RuntimeException(
                    "You can only create a message as yourself."
            );
        }

        Course course =
                courseRepository
                        .findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found."
                                )
                        );

        checkCourseAccess(
                courseId,
                currentUser
        );

        // Student cannot send if disabled.
        // Admin/teacher can still access
        // the course when disabled.
        if (isStudent(currentUser)) {

            checkChatEnabled(courseId);
        }

        if (
                discussionPost.getContent() == null ||
                discussionPost.getContent()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Message cannot be empty."
            );
        }

        /*
         * Chat messages don't really need
         * a title. We keep the existing database
         * structure compatible with your current
         * DiscussionPost entity.
         */

        if (
                discussionPost.getTitle() == null ||
                discussionPost.getTitle()
                        .trim()
                        .isEmpty()
        ) {

            discussionPost.setTitle(
                    "Course Chat Message"
            );
        }

        discussionPost.setCourse(course);

        discussionPost.setUser(
                currentUser
        );

        return discussionPostRepository
                .save(discussionPost);
    }


    // =====================================================
    // UPDATE DISCUSSION
    // ADMIN / TEACHER / ORIGINAL USER
    // =====================================================

    @Transactional
    public DiscussionPost updatePost(
            Long id,
            DiscussionPost updatedPost
    ) {

        User currentUser =
                getCurrentUser();

        DiscussionPost post =
                discussionPostRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Discussion not found."
                                )
                        );

        Course course =
                post.getCourse();

        if (course == null) {

            throw new RuntimeException(
                    "Discussion course not found."
            );
        }

        checkCourseAccess(
                course.getId(),
                currentUser
        );

        boolean allowed =
                isAdmin(currentUser)
                || isCourseTeacher(
                        currentUser,
                        course
                )
                || (
                        post.getUser() != null
                        && post.getUser()
                                .getId()
                                .equals(
                                        currentUser.getId()
                                )
                );

        if (!allowed) {

            throw new RuntimeException(
                    "You are not allowed to edit this message."
            );
        }

        if (
                updatedPost.getContent() == null ||
                updatedPost.getContent()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Message cannot be empty."
            );
        }

        post.setContent(
                updatedPost
                        .getContent()
                        .trim()
        );

        return discussionPostRepository
                .save(post);
    }


    // =====================================================
    // DELETE DISCUSSION
    // ADMIN / TEACHER / ORIGINAL USER
    // =====================================================

    @Transactional
    public void deletePost(
            Long id
    ) {

        User currentUser =
                getCurrentUser();

        DiscussionPost post =
                discussionPostRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Discussion not found."
                                )
                        );

        Course course =
                post.getCourse();

        if (course == null) {

            throw new RuntimeException(
                    "Discussion course not found."
            );
        }

        checkCourseAccess(
                course.getId(),
                currentUser
        );

        boolean allowed =
                isAdmin(currentUser)
                || isCourseTeacher(
                        currentUser,
                        course
                )
                || (
                        post.getUser() != null
                        && post.getUser()
                                .getId()
                                .equals(
                                        currentUser.getId()
                                )
                );

        if (!allowed) {

            throw new RuntimeException(
                    "You are not allowed to delete this message."
            );
        }

        discussionPostRepository
                .delete(post);
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @Transactional(readOnly = true)
    public List<DiscussionResponse> getAllPosts() {

        return discussionPostRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .collect(
                        Collectors.toList()
                );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @Transactional(readOnly = true)
    public DiscussionPost getPostById(
            Long id
    ) {

        return discussionPostRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Discussion not found."
                        )
                );
    }


    // =====================================================
    // GET BY COURSE
    // =====================================================

    @Transactional(readOnly = true)
    public List<DiscussionResponse>
    getPostsByCourse(
            Long courseId
    ) {

        User currentUser =
                getCurrentUser();

        checkCourseAccess(
                courseId,
                currentUser
        );

        return discussionPostRepository
                .findByCourseId(courseId)
                .stream()
                .map(this::toResponse)
                .collect(
                        Collectors.toList()
                );
    }


    // =====================================================
    // GET BY USER
    // =====================================================

    @Transactional(readOnly = true)
    public List<DiscussionResponse>
    getPostsByUser(
            Long userId
    ) {

        User currentUser =
                getCurrentUser();

        if (
                !currentUser.getId()
                        .equals(userId)
                && !isAdmin(currentUser)
        ) {

            throw new RuntimeException(
                    "You are not allowed to view these messages."
            );
        }

        return discussionPostRepository
                .findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(
                        Collectors.toList()
                );
    }


    // =====================================================
    // ENABLE / DISABLE COURSE CHAT
    // ADMIN + COURSE TEACHER
    // =====================================================

    @Transactional
    public boolean setChatStatus(
            Long courseId,
            boolean enabled
    ) {

        User currentUser =
                getCurrentUser();

        Course course =
                courseRepository
                        .findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found."
                                )
                        );

        if (
                !isAdmin(currentUser)
                && !isCourseTeacher(
                        currentUser,
                        course
                )
        ) {

            throw new RuntimeException(
                    "Only the administrator or course teacher can change chat status."
            );
        }

        CourseChatSetting setting =
                getOrCreateChatSetting(course);

        setting.setEnabled(enabled);

        courseChatSettingRepository
                .save(setting);

        return enabled;
    }


    // =====================================================
    // GET CHAT STATUS
    // =====================================================

    @Transactional
    public boolean getChatStatus(
            Long courseId
    ) {

        User currentUser =
                getCurrentUser();

        checkCourseAccess(
                courseId,
                currentUser
        );

        return isChatEnabled(courseId);
    }


    // =====================================================
    // CONVERT TO RESPONSE
    // =====================================================

    private DiscussionResponse toResponse(
            DiscussionPost post
    ) {

        boolean enabled = true;

        if (post.getCourse() != null) {

            enabled =
                    courseChatSettingRepository
                            .findByCourseId(
                                    post.getCourse()
                                            .getId()
                            )
                            .map(
                                    CourseChatSetting::isEnabled
                            )
                            .orElse(true);
        }

        return new DiscussionResponse(

                post.getId(),

                post.getTitle(),

                post.getContent(),

                post.getCreatedAt(),

                post.getCourse() != null
                        ? post.getCourse().getId()
                        : null,

                post.getCourse() != null
                        ? post.getCourse().getTitle()
                        : "No Course",

                post.getUser() != null
                        ? post.getUser().getId()
                        : null,

                post.getUser() != null
                        ? post.getUser().getFullName()
                        : "Unknown User",

                enabled
        );
    }
}