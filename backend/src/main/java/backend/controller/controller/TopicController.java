package backend.controller;

import backend.dto.TopicResponse;
import backend.entity.Topic;
import backend.service.TopicService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "*")
public class TopicController {

    private final TopicService topicService;


    public TopicController(
            TopicService topicService
    ) {

        this.topicService = topicService;
    }


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping("/{subjectId}")
    public Topic createTopic(
            @PathVariable Long subjectId,
            @RequestBody Topic topic
    ) {

        return topicService.createTopic(
                subjectId,
                topic
        );
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public List<TopicResponse> getAllTopics() {

        return topicService.getAllTopics();
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public Topic getTopicById(
            @PathVariable Long id
    ) {

        return topicService.getTopicById(id);
    }


    // =====================================================
    // GET BY SUBJECT
    // =====================================================

    @GetMapping("/subject/{subjectId}")
    public List<Topic> getTopicsBySubject(
            @PathVariable Long subjectId
    ) {

        return topicService.getTopicsBySubject(
                subjectId
        );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}/{subjectId}")
    public Topic updateTopic(
            @PathVariable Long id,
            @PathVariable Long subjectId,
            @RequestBody Topic topic
    ) {

        return topicService.updateTopic(
                id,
                subjectId,
                topic
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteTopic(
            @PathVariable Long id
    ) {

        topicService.deleteTopic(id);

        return "Topic deleted successfully.";
    }
}