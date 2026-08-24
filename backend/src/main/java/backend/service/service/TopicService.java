package backend.service;

import backend.dto.TopicResponse;
import backend.entity.Subject;
import backend.entity.Topic;
import backend.repository.SubjectRepository;
import backend.repository.TopicRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {

    private final TopicRepository topicRepository;

    private final SubjectRepository subjectRepository;

    private final EnrollmentService enrollmentService;


    public TopicService(
            TopicRepository topicRepository,
            SubjectRepository subjectRepository,
            EnrollmentService enrollmentService
    ) {

        this.topicRepository =
                topicRepository;

        this.subjectRepository =
                subjectRepository;

        this.enrollmentService =
                enrollmentService;
    }


    // =====================================================
    // CREATE
    // =====================================================

    public Topic createTopic(
            Long subjectId,
            Topic topic
    ) {

        Subject subject =
                subjectRepository.findById(subjectId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Subject not found"
                                )
                        );

        topic.setSubject(subject);

        return topicRepository.save(topic);
    }


    // =====================================================
    // GET ALL
    // =====================================================
    //
    // ADMIN
    //
    // =====================================================

    public List<TopicResponse> getAllTopics() {

        return topicRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET TOPICS FOR STUDENT
    // =====================================================

    public List<TopicResponse> getTopicsForStudent(
            Long studentId
    ) {

        List<Long> enrolledCourseIds =
                enrollmentService
                        .getStudentCourseIds(
                                studentId
                        );


        if (enrolledCourseIds.isEmpty()) {

            return List.of();
        }


        return topicRepository.findAll()
                .stream()
                .filter(topic ->
                        topic.getSubject() != null
                                &&
                        topic.getSubject().getCourse() != null
                                &&
                        topic.getSubject()
                                .getCourse()
                                .getId() != null
                                &&
                        enrolledCourseIds.contains(
                                topic.getSubject()
                                        .getCourse()
                                        .getId()
                        )
                )
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    public Topic getTopicById(
            Long id
    ) {

        return topicRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Topic not found"
                        )
                );
    }


    // =====================================================
    // GET TOPIC FOR STUDENT
    // =====================================================

    public Topic getTopicForStudent(
            Long studentId,
            Long topicId
    ) {

        Topic topic =
                getTopicById(topicId);


        if (
                topic.getSubject() == null ||
                topic.getSubject().getCourse() == null
        ) {

            throw new RuntimeException(
                    "Topic is not associated with a course."
            );
        }


        Long courseId =
                topic.getSubject()
                        .getCourse()
                        .getId();


        if (
                !enrollmentService
                        .isStudentEnrolled(
                                studentId,
                                courseId
                        )
        ) {

            throw new RuntimeException(
                    "Student is not enrolled in this course."
            );
        }


        return topic;
    }


    // =====================================================
    // GET BY SUBJECT
    // =====================================================

    public List<Topic> getTopicsBySubject(
            Long subjectId
    ) {

        return topicRepository
                .findBySubjectId(subjectId);
    }


    // =====================================================
    // GET BY SUBJECT FOR STUDENT
    // =====================================================

    public List<Topic> getTopicsBySubjectForStudent(
            Long studentId,
            Long subjectId
    ) {

        Subject subject =
                subjectRepository.findById(
                        subjectId
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Subject not found"
                        )
                );


        if (
                subject.getCourse() == null
        ) {

            throw new RuntimeException(
                    "Subject is not associated with a course."
            );
        }


        Long courseId =
                subject.getCourse().getId();


        if (
                !enrollmentService
                        .isStudentEnrolled(
                                studentId,
                                courseId
                        )
        ) {

            throw new RuntimeException(
                    "Student is not enrolled in this course."
            );
        }


        return topicRepository
                .findBySubjectId(subjectId);
    }


    // =====================================================
    // ENTITY -> DTO
    // =====================================================

    private TopicResponse mapToResponse(
            Topic topic
    ) {

        return new TopicResponse(

                topic.getId(),

                topic.getTitle(),

                topic.getContent(),

                topic.getSubject() != null
                        ? topic.getSubject().getId()
                        : null,

                topic.getSubject() != null
                        ? topic.getSubject().getName()
                        : "No Subject",

                topic.getSubject() != null
                        && topic.getSubject().getCourse() != null
                        ? topic.getSubject()
                                .getCourse()
                                .getId()
                        : null,

                topic.getSubject() != null
                        && topic.getSubject().getCourse() != null
                        ? topic.getSubject()
                                .getCourse()
                                .getTitle()
                        : "No Course"
        );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    public Topic updateTopic(
            Long id,
            Long subjectId,
            Topic updatedTopic
    ) {

        Topic topic =
                getTopicById(id);


        Subject subject =
                subjectRepository.findById(
                        subjectId
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Subject not found"
                        )
                );


        topic.setTitle(
                updatedTopic.getTitle()
        );

        topic.setContent(
                updatedTopic.getContent()
        );

        topic.setSubject(subject);


        return topicRepository.save(topic);
    }


    // =====================================================
    // DELETE
    // =====================================================

    public void deleteTopic(
            Long id
    ) {

        Topic topic =
                getTopicById(id);

        topicRepository.delete(topic);
    }
}