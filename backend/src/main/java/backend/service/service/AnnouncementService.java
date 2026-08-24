package backend.service;

import backend.dto.AnnouncementRequest;
import backend.dto.AnnouncementResponse;
import backend.entity.Announcement;
import backend.entity.Course;
import backend.entity.Enrollment;
import backend.entity.Notification;
import backend.repository.AnnouncementRepository;
import backend.repository.CourseRepository;
import backend.repository.EnrollmentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    private final CourseRepository courseRepository;

    private final EnrollmentRepository enrollmentRepository;

    private final NotificationService notificationService;


    public AnnouncementService(

            AnnouncementRepository announcementRepository,

            CourseRepository courseRepository,

            EnrollmentRepository enrollmentRepository,

            NotificationService notificationService

    ) {

        this.announcementRepository = announcementRepository;

        this.courseRepository = courseRepository;

        this.enrollmentRepository = enrollmentRepository;

        this.notificationService = notificationService;
    }


    // =========================================================
    // CREATE ANNOUNCEMENT
    // =========================================================

    public AnnouncementResponse createAnnouncement(

            Long courseId,

            AnnouncementRequest request

    ) {

        // Find course
        Course course = courseRepository.findById(courseId)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with ID: " + courseId
                        )
                );


        // Create announcement
        Announcement announcement = new Announcement();

        announcement.setTitle(request.getTitle());

        announcement.setMessage(request.getMessage());

        announcement.setCourse(course);


        // Save announcement
        Announcement savedAnnouncement =
                announcementRepository.save(announcement);


        // =====================================================
        // CREATE NOTIFICATION FOR ENROLLED STUDENTS
        // =====================================================

        List<Enrollment> enrollments =
                enrollmentRepository.findByCourseId(courseId);


        for (Enrollment enrollment : enrollments) {

            if (enrollment.getStudent() == null) {
                continue;
            }


            Notification notification = new Notification();


            notification.setTitle(
                    "New Announcement"
            );


            notification.setMessage(

                    "A new announcement has been posted in "

                            + course.getTitle()

                            + ": "

                            + savedAnnouncement.getTitle()
            );


            notificationService.createNotification(

                    enrollment.getStudent().getId(),

                    notification
            );
        }


        return convertToResponse(savedAnnouncement);
    }


    // =========================================================
    // UPDATE ANNOUNCEMENT
    // =========================================================

    public AnnouncementResponse updateAnnouncement(

            Long id,

            AnnouncementRequest request

    ) {

        Announcement announcement =
                announcementRepository.findById(id)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Announcement not found with ID: " + id
                                )
                        );


        // Update title
        announcement.setTitle(
                request.getTitle()
        );


        // Update message
        announcement.setMessage(
                request.getMessage()
        );


        // Update course if supplied
        if (request.getCourseId() != null) {

            Course course =
                    courseRepository.findById(
                            request.getCourseId()
                    )

                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Course not found with ID: "
                                                    + request.getCourseId()
                                    )
                            );


            announcement.setCourse(course);
        }


        Announcement savedAnnouncement =
                announcementRepository.save(announcement);


        return convertToResponse(savedAnnouncement);
    }


    // =========================================================
    // GET ALL
    // =========================================================

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAllAnnouncements() {

        return announcementRepository.findAll()

                .stream()

                .map(this::convertToResponse)

                .collect(Collectors.toList());
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public AnnouncementResponse getAnnouncementById(

            Long id

    ) {

        Announcement announcement =
                announcementRepository.findById(id)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Announcement not found with ID: " + id
                                )
                        );


        return convertToResponse(announcement);
    }


    // =========================================================
    // GET BY COURSE
    // =========================================================

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAnnouncementsByCourse(

            Long courseId

    ) {

        return announcementRepository
                .findByCourseId(courseId)

                .stream()

                .map(this::convertToResponse)

                .collect(Collectors.toList());
    }


    // =========================================================
    // DELETE
    // =========================================================

    public void deleteAnnouncement(Long id) {

        Announcement announcement =
                announcementRepository.findById(id)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Announcement not found with ID: " + id
                                )
                        );


        announcementRepository.delete(announcement);
    }


    // =========================================================
    // CONVERT ENTITY -> RESPONSE
    // =========================================================

    private AnnouncementResponse convertToResponse(

            Announcement announcement

    ) {

        Long courseId = null;

        String courseTitle = "No Course";


        if (announcement.getCourse() != null) {

            courseId =
                    announcement.getCourse().getId();

            courseTitle =
                    announcement.getCourse().getTitle();
        }


        return new AnnouncementResponse(

                announcement.getId(),

                announcement.getTitle(),

                announcement.getMessage(),

                announcement.getCreatedAt(),

                courseId,

                courseTitle
        );
    }
}