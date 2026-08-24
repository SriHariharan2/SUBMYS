package backend.controller;

import backend.dto.DiscussionResponse;
import backend.entity.DiscussionPost;
import backend.service.DiscussionPostService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discussions")
public class DiscussionPostController {

    private final DiscussionPostService
            discussionPostService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DiscussionPostController(
            DiscussionPostService discussionPostService
    ) {

        this.discussionPostService =
                discussionPostService;
    }


    // =====================================================
    // CREATE CHAT MESSAGE
    // =====================================================

    @PostMapping(
            "/course/{courseId}/user/{userId}"
    )
    public ResponseEntity<DiscussionPost>
    createPost(

            @PathVariable Long courseId,

            @PathVariable Long userId,

            @RequestBody DiscussionPost discussionPost

    ) {

        return ResponseEntity.ok(

                discussionPostService.createPost(

                        courseId,

                        userId,

                        discussionPost

                )
        );
    }


    // =====================================================
    // UPDATE MESSAGE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<DiscussionPost>
    updatePost(

            @PathVariable Long id,

            @RequestBody DiscussionPost discussionPost

    ) {

        return ResponseEntity.ok(

                discussionPostService.updatePost(
                        id,
                        discussionPost
                )
        );
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public ResponseEntity<List<DiscussionResponse>>
    getAllPosts() {

        return ResponseEntity.ok(

                discussionPostService
                        .getAllPosts()
        );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<DiscussionPost>
    getPostById(

            @PathVariable Long id

    ) {

        return ResponseEntity.ok(

                discussionPostService
                        .getPostById(id)
        );
    }


    // =====================================================
    // GET BY COURSE
    // =====================================================

    @GetMapping("/course/{courseId}")
    public ResponseEntity<
            List<DiscussionResponse>
            >
    getPostsByCourse(

            @PathVariable Long courseId

    ) {

        return ResponseEntity.ok(

                discussionPostService
                        .getPostsByCourse(courseId)
        );
    }


    // =====================================================
    // GET BY USER
    // =====================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<
            List<DiscussionResponse>
            >
    getPostsByUser(

            @PathVariable Long userId

    ) {

        return ResponseEntity.ok(

                discussionPostService
                        .getPostsByUser(userId)
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deletePost(

            @PathVariable Long id

    ) {

        discussionPostService
                .deletePost(id);

        return ResponseEntity.ok(
                "Discussion deleted successfully."
        );
    }


    // =====================================================
    // GET CHAT STATUS
    // =====================================================

    @GetMapping(
            "/course/{courseId}/chat-status"
    )
    public ResponseEntity<Boolean>
    getChatStatus(

            @PathVariable Long courseId

    ) {

        return ResponseEntity.ok(

                discussionPostService
                        .getChatStatus(courseId)
        );
    }


    // =====================================================
    // ENABLE / DISABLE CHAT
    // =====================================================

    @PutMapping(
            "/course/{courseId}/chat-status"
    )
    public ResponseEntity<String>
    setChatStatus(

            @PathVariable Long courseId,

            @RequestParam boolean enabled

    ) {

        discussionPostService
                .setChatStatus(
                        courseId,
                        enabled
                );

        return ResponseEntity.ok(

                enabled
                        ? "Course chat enabled successfully."
                        : "Course chat disabled successfully."
        );
    }
}