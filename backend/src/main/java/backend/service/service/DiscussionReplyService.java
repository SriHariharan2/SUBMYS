package backend.service;

import backend.dto.ReplyResponse;
import backend.entity.DiscussionPost;
import backend.entity.DiscussionReply;
import backend.entity.Notification;
import backend.entity.User;
import backend.repository.DiscussionPostRepository;
import backend.repository.DiscussionReplyRepository;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscussionReplyService {

    private final DiscussionReplyRepository discussionReplyRepository;
    private final DiscussionPostRepository discussionPostRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public DiscussionReplyService(
            DiscussionReplyRepository discussionReplyRepository,
            DiscussionPostRepository discussionPostRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {

        this.discussionReplyRepository = discussionReplyRepository;
        this.discussionPostRepository = discussionPostRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;

    }

    // ================= CREATE REPLY =================

    public DiscussionReply createReply(
            Long discussionPostId,
            Long userId,
            DiscussionReply discussionReply
    ) {

        DiscussionPost discussionPost =
                discussionPostRepository.findById(discussionPostId)

                        .orElseThrow(() ->
                                new RuntimeException("Discussion post not found."));

        User user =
                userRepository.findById(userId)

                        .orElseThrow(() ->
                                new RuntimeException("User not found."));

        discussionReply.setDiscussionPost(discussionPost);
        discussionReply.setUser(user);

        DiscussionReply savedReply =
                discussionReplyRepository.save(discussionReply);

        if (!discussionPost.getUser().getId().equals(user.getId())) {

            Notification notification = new Notification();

            notification.setTitle("New Discussion Reply");

            notification.setMessage(

                    user.getFullName()

                            + " replied to your discussion: "

                            + discussionPost.getTitle()

            );

            notificationService.createNotification(

                    discussionPost.getUser().getId(),

                    notification

            );

        }

        return savedReply;

    }

    // ================= UPDATE =================

    public DiscussionReply updateReply(
            Long id,
            DiscussionReply updatedReply
    ) {

        DiscussionReply reply =
                discussionReplyRepository.findById(id)

                        .orElseThrow(() ->
                                new RuntimeException("Reply not found."));

        reply.setMessage(updatedReply.getMessage());

        return discussionReplyRepository.save(reply);

    }

    // ================= GET ALL =================

    public List<ReplyResponse> getAllReplies() {

        return discussionReplyRepository.findAll()

                .stream()

                .map(reply -> new ReplyResponse(

                        reply.getId(),

                        reply.getMessage(),

                        reply.getCreatedAt(),

                        reply.getDiscussionPost() != null
                                ? reply.getDiscussionPost().getId()
                                : null,

                        reply.getDiscussionPost() != null
                                ? reply.getDiscussionPost().getTitle()
                                : "No Discussion",

                        reply.getUser() != null
                                ? reply.getUser().getId()
                                : null,

                        reply.getUser() != null
                                ? reply.getUser().getFullName()
                                : "No User"

                ))

                .collect(Collectors.toList());

    }
        // ================= GET REPLY BY ID =================

    public DiscussionReply getReplyById(Long id) {

        return discussionReplyRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException("Reply not found."));

    }

    // ================= GET REPLIES BY DISCUSSION =================

    public List<ReplyResponse> getRepliesByDiscussionPost(
            Long discussionPostId
    ) {

        return discussionReplyRepository
                .findByDiscussionPostId(discussionPostId)

                .stream()

                .map(reply -> new ReplyResponse(

                        reply.getId(),

                        reply.getMessage(),

                        reply.getCreatedAt(),

                        reply.getDiscussionPost() != null
                                ? reply.getDiscussionPost().getId()
                                : null,

                        reply.getDiscussionPost() != null
                                ? reply.getDiscussionPost().getTitle()
                                : "No Discussion",

                        reply.getUser() != null
                                ? reply.getUser().getId()
                                : null,

                        reply.getUser() != null
                                ? reply.getUser().getFullName()
                                : "No User"

                ))

                .collect(Collectors.toList());

    }

    // ================= GET REPLIES BY USER =================

    public List<ReplyResponse> getRepliesByUser(Long userId) {

        return discussionReplyRepository.findByUserId(userId)

                .stream()

                .map(reply -> new ReplyResponse(

                        reply.getId(),

                        reply.getMessage(),

                        reply.getCreatedAt(),

                        reply.getDiscussionPost() != null
                                ? reply.getDiscussionPost().getId()
                                : null,

                        reply.getDiscussionPost() != null
                                ? reply.getDiscussionPost().getTitle()
                                : "No Discussion",

                        reply.getUser() != null
                                ? reply.getUser().getId()
                                : null,

                        reply.getUser() != null
                                ? reply.getUser().getFullName()
                                : "No User"

                ))

                .collect(Collectors.toList());

    }

    // ================= DELETE =================

    public void deleteReply(Long id) {

        DiscussionReply reply =
                discussionReplyRepository.findById(id)

                        .orElseThrow(() ->
                                new RuntimeException("Reply not found."));

        discussionReplyRepository.delete(reply);

    }

}