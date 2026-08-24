package backend.controller;

import backend.dto.ReplyResponse;
import backend.entity.DiscussionReply;
import backend.service.DiscussionReplyService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discussion-replies")
public class DiscussionReplyController {

    private final DiscussionReplyService discussionReplyService;

    public DiscussionReplyController(
            DiscussionReplyService discussionReplyService
    ) {
        this.discussionReplyService = discussionReplyService;
    }

    // ================= CREATE =================

    @PostMapping("/post/{discussionPostId}/user/{userId}")
    public ResponseEntity<DiscussionReply> createReply(

            @PathVariable Long discussionPostId,

            @PathVariable Long userId,

            @RequestBody DiscussionReply discussionReply

    ) {

        return ResponseEntity.ok(

                discussionReplyService.createReply(

                        discussionPostId,

                        userId,

                        discussionReply

                )

        );

    }

    // ================= UPDATE =================

    @PutMapping("/{id}")
    public ResponseEntity<DiscussionReply> updateReply(

            @PathVariable Long id,

            @RequestBody DiscussionReply discussionReply

    ) {

        return ResponseEntity.ok(

                discussionReplyService.updateReply(

                        id,

                        discussionReply

                )

        );

    }

    // ================= GET ALL =================

    @GetMapping
    public ResponseEntity<List<ReplyResponse>> getAllReplies() {

        return ResponseEntity.ok(

                discussionReplyService.getAllReplies()

        );

    }

    // ================= GET BY ID =================

    @GetMapping("/{id}")
    public ResponseEntity<DiscussionReply> getReplyById(

            @PathVariable Long id

    ) {

        return ResponseEntity.ok(

                discussionReplyService.getReplyById(id)

        );

    }

    // ================= GET BY DISCUSSION =================

    @GetMapping("/post/{discussionPostId}")
    public ResponseEntity<List<ReplyResponse>> getRepliesByDiscussionPost(

            @PathVariable Long discussionPostId

    ) {

        return ResponseEntity.ok(

                discussionReplyService.getRepliesByDiscussionPost(
                        discussionPostId
                )

        );

    }

    // ================= GET BY USER =================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReplyResponse>> getRepliesByUser(

            @PathVariable Long userId

    ) {

        return ResponseEntity.ok(

                discussionReplyService.getRepliesByUser(
                        userId
                )

        );

    }

    // ================= DELETE =================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReply(

            @PathVariable Long id

    ) {

        discussionReplyService.deleteReply(id);

        return ResponseEntity.ok(
                "Reply deleted successfully."
        );

    }

}