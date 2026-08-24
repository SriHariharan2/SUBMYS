package backend.service;

import backend.entity.Certificate;
import backend.entity.Course;
import backend.entity.User;
import backend.repository.CertificateRepository;
import backend.repository.CourseRepository;
import backend.repository.UserRepository;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final Cloudinary cloudinary;

    public CertificateService(
            CertificateRepository certificateRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            Cloudinary cloudinary
    ) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.cloudinary = cloudinary;
    }

    // =========================================================
    // GENERATE CERTIFICATE AUTOMATICALLY
    // Called by CourseProgressService
    // =========================================================

    public Certificate generateCertificate(
            Long studentId,
            Long courseId
    ) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found.")
                );

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found.")
                );

        // Do not create duplicate certificate
        return certificateRepository
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseGet(() -> {

                    Certificate certificate = new Certificate();

                    certificate.setStudent(student);
                    certificate.setCourse(course);

                    certificate.setCertificateNumber(
                            generateCertificateNumber()
                    );

                    /*
                     * This certificate is generated automatically
                     * after course completion.
                     *
                     * No uploaded file is required here.
                     */

                    return certificateRepository.save(certificate);
                });
    }

    // =========================================================
    // GENERATE UNIQUE CERTIFICATE NUMBER
    // =========================================================

    private String generateCertificateNumber() {

        String certificateNumber;

        do {

            certificateNumber =
                    "CERT-" +
                    UUID.randomUUID()
                            .toString()
                            .substring(0, 8)
                            .toUpperCase();

        } while (
                certificateRepository
                        .findByCertificateNumber(certificateNumber)
                        .isPresent()
        );

        return certificateNumber;
    }

    // =========================================================
    // ADMIN / TEACHER UPLOAD CERTIFICATE
    // =========================================================

    public Certificate uploadCertificate(
            Long studentId,
            Long courseId,
            MultipartFile file
    ) {

        // -----------------------------------------------------
        // Validate file
        // -----------------------------------------------------

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Certificate file is required."
            );
        }

        String contentType = file.getContentType();

        if (contentType == null) {

            throw new RuntimeException(
                    "Unable to determine certificate file type."
            );
        }

        boolean validPdf =
                contentType.equalsIgnoreCase("application/pdf");

        boolean validImage =
                contentType.toLowerCase()
                        .startsWith("image/");

        if (!validPdf && !validImage) {

            throw new RuntimeException(
                    "Only PDF and image certificate files are allowed."
            );
        }

        // -----------------------------------------------------
        // Maximum file size = 10 MB
        // -----------------------------------------------------

        if (file.getSize() > 10 * 1024 * 1024) {

            throw new RuntimeException(
                    "Certificate file must be smaller than 10 MB."
            );
        }

        // -----------------------------------------------------
        // Find student
        // -----------------------------------------------------

        User student = userRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found."
                        )
                );

        // -----------------------------------------------------
        // Find course
        // -----------------------------------------------------

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found."
                        )
                );

        // -----------------------------------------------------
        // Prevent duplicate certificate
        // -----------------------------------------------------

        boolean exists =
                certificateRepository
                        .findByStudentIdAndCourseId(
                                studentId,
                                courseId
                        )
                        .isPresent();

        if (exists) {

            throw new RuntimeException(
                    "Certificate already exists for this student and course."
            );
        }

        // -----------------------------------------------------
        // Upload to Cloudinary
        // -----------------------------------------------------

        try {

            String publicId =
                    "certificates/" +
                    UUID.randomUUID();

            var uploadResult =
                    cloudinary.uploader().upload(
                            file.getBytes(),
                            ObjectUtils.asMap(
                                    "public_id",
                                    publicId,

                                    "resource_type",
                                    "auto"
                            )
                    );

            String secureUrl =
                    (String) uploadResult.get(
                            "secure_url"
                    );

            String uploadedPublicId =
                    (String) uploadResult.get(
                            "public_id"
                    );

            // -------------------------------------------------
            // Create Certificate
            // -------------------------------------------------

            Certificate certificate =
                    new Certificate();

            certificate.setStudent(student);

            certificate.setCourse(course);

            certificate.setCertificateNumber(
                    generateCertificateNumber()
            );

            certificate.setFileUrl(
                    secureUrl
            );

            certificate.setFilePublicId(
                    uploadedPublicId
            );

            certificate.setOriginalFileName(
                    file.getOriginalFilename()
            );

            certificate.setContentType(
                    contentType
            );

            return certificateRepository.save(
                    certificate
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload certificate file.",
                    e
            );
        }
    }

    // =========================================================
    // GET ALL CERTIFICATES
    // ADMIN / TEACHER
    // =========================================================

    public List<Certificate> getAllCertificates() {

        return certificateRepository.findAll();
    }

    // =========================================================
    // GET STUDENT CERTIFICATES
    // =========================================================

    public List<Certificate> getStudentCertificates(
            Long studentId
    ) {

        if (!userRepository.existsById(studentId)) {

            throw new RuntimeException(
                    "Student not found."
            );
        }

        return certificateRepository
                .findByStudentId(studentId);
    }

    // =========================================================
    // GET COURSE CERTIFICATES
    // ADMIN / TEACHER
    // =========================================================

    public List<Certificate> getCourseCertificates(
            Long courseId
    ) {

        if (!courseRepository.existsById(courseId)) {

            throw new RuntimeException(
                    "Course not found."
            );
        }

        return certificateRepository
                .findByCourseId(courseId);
    }

    // =========================================================
    // GET CERTIFICATE BY ID
    // =========================================================

    public Certificate getCertificate(
            Long id
    ) {

        return certificateRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Certificate not found."
                        )
                );
    }

    // =========================================================
    // GET CERTIFICATE BY STUDENT + COURSE
    // =========================================================

    public Certificate getCertificate(
            Long studentId,
            Long courseId
    ) {

        return certificateRepository
                .findByStudentIdAndCourseId(
                        studentId,
                        courseId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Certificate not found."
                        )
                );
    }

    // =========================================================
    // DELETE CERTIFICATE
    // ADMIN / TEACHER
    // =========================================================

    public void deleteCertificate(
            Long id
    ) {

        Certificate certificate =
                certificateRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Certificate not found."
                                )
                        );

        // -----------------------------------------------------
        // Delete uploaded file from Cloudinary
        // -----------------------------------------------------

        if (certificate.getFilePublicId() != null &&
                !certificate.getFilePublicId().isBlank()) {

            try {

                String resourceType =
                        "image";

                if (
                        certificate.getContentType() != null &&
                        certificate.getContentType()
                                .equalsIgnoreCase(
                                        "application/pdf"
                                )
                ) {
                    resourceType = "raw";
                }

                cloudinary.uploader().destroy(
                        certificate.getFilePublicId(),
                        ObjectUtils.asMap(
                                "resource_type",
                                resourceType
                        )
                );

            } catch (Exception e) {

                System.err.println(
                        "Cloudinary delete failed: "
                                + e.getMessage()
                );
            }
        }

        // -----------------------------------------------------
        // Delete database record
        // -----------------------------------------------------

        certificateRepository.delete(
                certificate
        );
    }
}