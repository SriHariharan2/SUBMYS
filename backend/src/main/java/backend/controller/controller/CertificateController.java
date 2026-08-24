package backend.controller;

import backend.entity.Certificate;
import backend.service.CertificateService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "http://localhost:5173")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(
            CertificateService certificateService
    ) {
        this.certificateService = certificateService;
    }

    // =========================================================
    // ADMIN / TEACHER UPLOAD
    // =========================================================

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> uploadCertificate(

            @RequestParam("studentId")
            Long studentId,

            @RequestParam("courseId")
            Long courseId,

            @RequestParam("file")
            MultipartFile file

    ) {

        try {

            Certificate certificate =
                    certificateService.uploadCertificate(
                            studentId,
                            courseId,
                            file
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(certificate);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            java.util.Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================================
    // ADMIN / TEACHER GET ALL
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Certificate>>
    getAllCertificates() {

        return ResponseEntity.ok(
                certificateService.getAllCertificates()
        );
    }

    // =========================================================
    // STUDENT CERTIFICATES
    // =========================================================

    @GetMapping("/student/{studentId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')"
    )
    public ResponseEntity<List<Certificate>>
    getStudentCertificates(
            @PathVariable Long studentId
    ) {

        return ResponseEntity.ok(
                certificateService
                        .getStudentCertificates(studentId)
        );
    }

    // =========================================================
    // COURSE CERTIFICATES
    // =========================================================

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Certificate>>
    getCourseCertificates(
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                certificateService
                        .getCourseCertificates(courseId)
        );
    }

    // =========================================================
    // GET ONE
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')"
    )
    public ResponseEntity<Certificate>
    getCertificate(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                certificateService.getCertificate(id)
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> deleteCertificate(
            @PathVariable Long id
    ) {

        certificateService.deleteCertificate(id);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "Certificate deleted successfully."
                )
        );
    }
}