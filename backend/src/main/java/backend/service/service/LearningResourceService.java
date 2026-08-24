package backend.service;

import backend.dto.LearningResourceResponse;
import backend.entity.LearningResource;
import backend.entity.Topic;
import backend.entity.Subject;
import backend.entity.Course;

import backend.repository.LearningResourceRepository;
import backend.repository.TopicRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningResourceService {

    private final LearningResourceRepository learningResourceRepository;

    private final TopicRepository topicRepository;

    private final CloudinaryService cloudinaryService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public LearningResourceService(
            LearningResourceRepository learningResourceRepository,
            TopicRepository topicRepository,
            CloudinaryService cloudinaryService
    ) {

        this.learningResourceRepository =
                learningResourceRepository;

        this.topicRepository =
                topicRepository;

        this.cloudinaryService =
                cloudinaryService;
    }


    // =====================================================
    // CREATE RESOURCE
    // VIDEO / LINK
    // =====================================================

    public LearningResource createResource(
            Long topicId,
            LearningResource resource
    ) {

        Topic topic =
                topicRepository.findById(topicId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Topic not found."
                                )
                        );

        resource.setTopic(topic);

        return learningResourceRepository.save(resource);
    }


    // =====================================================
    // CREATE RESOURCE WITH FILE
    // PDF / PPT
    // =====================================================

    public LearningResource createResourceWithFile(

            Long topicId,

            String title,

            String description,

            String resourceType,

            MultipartFile file

    ) {

        Topic topic =
                topicRepository.findById(topicId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Topic not found."
                                )
                        );


        String fileUrl =
                cloudinaryService.uploadFile(file);


        LearningResource resource =
                new LearningResource();


        resource.setTitle(title);

        resource.setDescription(description);

        resource.setResourceType(resourceType);

        resource.setResourceUrl(fileUrl);

        resource.setTopic(topic);


        return learningResourceRepository.save(
                resource
        );
    }


    // =====================================================
    // REPLACE FILE
    // =====================================================

    public LearningResource replaceFile(

            Long id,

            String title,

            String description,

            String resourceType,

            MultipartFile file

    ) {

        LearningResource resource =
                learningResourceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resource not found."
                                )
                        );


        String fileUrl =
                cloudinaryService.uploadFile(file);


        resource.setTitle(title);

        resource.setDescription(description);

        resource.setResourceType(resourceType);

        resource.setResourceUrl(fileUrl);


        return learningResourceRepository.save(
                resource
        );
    }


    // =====================================================
    // UPDATE VIDEO / LINK
    // =====================================================

    public LearningResource updateResource(

            Long id,

            LearningResource updatedResource

    ) {

        LearningResource resource =
                learningResourceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Learning Resource not found."
                                )
                        );


        resource.setTitle(
                updatedResource.getTitle()
        );

        resource.setDescription(
                updatedResource.getDescription()
        );

        resource.setResourceType(
                updatedResource.getResourceType()
        );

        resource.setResourceUrl(
                updatedResource.getResourceUrl()
        );


        return learningResourceRepository.save(
                resource
        );
    }


    // =====================================================
    // ENTITY → DTO
    // =====================================================

    private LearningResourceResponse mapToResponse(
            LearningResource resource
    ) {

        Long topicId = null;

        String topicTitle = null;

        Long subjectId = null;

        String subjectName = null;

        Long courseId = null;

        String courseTitle = null;


        // =================================================
        // TOPIC
        // =================================================

        if (resource.getTopic() != null) {

            Topic topic =
                    resource.getTopic();


            topicId =
                    topic.getId();

            topicTitle =
                    topic.getTitle();


            // =============================================
            // SUBJECT
            // =============================================

            if (topic.getSubject() != null) {

                Subject subject =
                        topic.getSubject();


                subjectId =
                        subject.getId();

                subjectName =
                        subject.getName();


                // =========================================
                // COURSE
                // =========================================

                if (subject.getCourse() != null) {

                    Course course =
                            subject.getCourse();


                    courseId =
                            course.getId();

                    courseTitle =
                            course.getTitle();
                }
            }
        }


        return new LearningResourceResponse(

                // RESOURCE
                resource.getId(),

                resource.getTitle(),

                resource.getDescription(),

                resource.getResourceType(),

                resource.getResourceUrl(),

                // TOPIC
                topicId,

                topicTitle,

                // SUBJECT
                subjectId,

                subjectName,

                // COURSE
                courseId,

                courseTitle
        );
    }


    // =====================================================
    // GET ALL RESOURCES
    // =====================================================

    public List<LearningResourceResponse>
    getAllResources() {

        return learningResourceRepository
                .findAll()

                .stream()

                .map(this::mapToResponse)

                .collect(
                        Collectors.toList()
                );
    }


    // =====================================================
    // GET RESOURCE BY ID
    // =====================================================

    public LearningResource getResourceById(
            Long id
    ) {

        return learningResourceRepository
                .findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Learning Resource not found."
                        )
                );
    }


    // =====================================================
    // GET RESOURCES BY TOPIC
    // =====================================================

    public List<LearningResource>
    getResourcesByTopic(
            Long topicId
    ) {

        return learningResourceRepository
                .findByTopicId(topicId);
    }


    // =====================================================
    // DELETE RESOURCE
    // =====================================================

    public void deleteResource(
            Long id
    ) {

        LearningResource resource =
                learningResourceRepository
                        .findById(id)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Learning Resource not found."
                                )
                        );


        learningResourceRepository.delete(
                resource
        );
    }
}