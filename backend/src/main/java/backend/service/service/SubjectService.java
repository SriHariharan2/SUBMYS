package backend.service;

import backend.dto.SubjectResponse;
import backend.entity.Course;
import backend.entity.Subject;
import backend.repository.CourseRepository;
import backend.repository.SubjectRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    private final CourseRepository courseRepository;

    private final EnrollmentService enrollmentService;


    public SubjectService(
            SubjectRepository subjectRepository,
            CourseRepository courseRepository,
            EnrollmentService enrollmentService
    ) {

        this.subjectRepository =
                subjectRepository;

        this.courseRepository =
                courseRepository;

        this.enrollmentService =
                enrollmentService;
    }


    // =====================================================
    // CREATE SUBJECT
    // =====================================================

    public Subject createSubject(
            Long courseId,
            Subject subject
    ) {

        Course course =
                courseRepository.findById(courseId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Course not found"
                                )
                        );

        subject.setCourse(course);

        return subjectRepository.save(
                subject
        );
    }


    // =====================================================
    // GET ALL SUBJECTS
    // =====================================================
    //
    // ADMIN
    //
    // =====================================================

    public List<SubjectResponse> getAllSubjects() {

        return subjectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET SUBJECTS FOR STUDENT
    // =====================================================

    public List<SubjectResponse> getSubjectsForStudent(
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


        return subjectRepository.findAll()
                .stream()
                .filter(subject ->
                        subject.getCourse() != null
                                &&
                        subject.getCourse().getId() != null
                                &&
                        enrolledCourseIds.contains(
                                subject.getCourse().getId()
                        )
                )
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET SUBJECT BY ID
    // =====================================================

    public Subject getSubjectById(
            Long id
    ) {

        return subjectRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Subject not found"
                        )
                );
    }


    // =====================================================
    // GET SUBJECT FOR STUDENT
    // =====================================================

    public Subject getSubjectForStudent(
            Long studentId,
            Long subjectId
    ) {

        Subject subject =
                getSubjectById(subjectId);


        if (
                subject.getCourse() == null ||
                subject.getCourse().getId() == null
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


        return subject;
    }


    // =====================================================
    // GET SUBJECTS BY COURSE
    // =====================================================

    public List<Subject> getSubjectsByCourse(
            Long courseId
    ) {

        return subjectRepository
                .findByCourseId(courseId);
    }


    // =====================================================
    // GET SUBJECTS BY COURSE FOR STUDENT
    // =====================================================

    public List<Subject> getSubjectsByCourseForStudent(
            Long studentId,
            Long courseId
    ) {

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


        return subjectRepository
                .findByCourseId(courseId);
    }


    // =====================================================
    // ENTITY -> DTO
    // =====================================================

    private SubjectResponse mapToResponse(
            Subject subject
    ) {

        return new SubjectResponse(

                subject.getId(),

                subject.getName(),

                subject.getCourse() != null
                        ? subject.getCourse().getId()
                        : null,

                subject.getCourse() != null
                        ? subject.getCourse().getTitle()
                        : "No Course"
        );
    }


    // =====================================================
    // UPDATE SUBJECT
    // =====================================================

    public Subject updateSubject(
            Long id,
            Long courseId,
            Subject updatedSubject
    ) {

        Subject subject =
                subjectRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Subject not found"
                                )
                        );


        Course course =
                courseRepository.findById(courseId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Course not found"
                                )
                        );


        subject.setName(
                updatedSubject.getName()
        );

        subject.setCourse(course);


        return subjectRepository.save(
                subject
        );
    }


    // =====================================================
    // DELETE SUBJECT
    // =====================================================

    public void deleteSubject(
            Long id
    ) {

        Subject subject =
                subjectRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Subject not found"
                                )
                        );

        subjectRepository.delete(subject);
    }
}