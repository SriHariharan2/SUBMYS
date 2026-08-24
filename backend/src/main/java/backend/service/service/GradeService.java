package backend.service;

import backend.entity.Assignment;
import backend.entity.Grade;
import backend.entity.Quiz;
import backend.entity.User;

import backend.repository.AssignmentRepository;
import backend.repository.GradeRepository;
import backend.repository.QuizRepository;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private QuizRepository quizRepository;


    // =====================================================
    // ADD GRADE
    // =====================================================

    public Grade addGrade(
            Long studentId,
            Long assignmentId,
            Long quizId,
            Grade grade
    ) {

        User student =
                userRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        grade.setStudent(student);


        // =================================================
        // ASSIGNMENT
        // =================================================

        if (assignmentId != null) {

            Assignment assignment =
                    assignmentRepository.findById(assignmentId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Assignment not found"
                                    )
                            );


            if (
                    gradeRepository
                            .findByStudentIdAndAssignmentId(
                                    studentId,
                                    assignmentId
                            )
                            .isPresent()
            ) {

                throw new RuntimeException(
                        "Grade already exists for this assignment."
                );
            }


            grade.setAssignment(assignment);
        }


        // =================================================
        // QUIZ
        // =================================================

        if (quizId != null) {

            Quiz quiz =
                    quizRepository.findById(quizId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Quiz not found"
                                    )
                            );


            if (
                    gradeRepository
                            .findByStudentIdAndQuizId(
                                    studentId,
                                    quizId
                            )
                            .isPresent()
            ) {

                throw new RuntimeException(
                        "Grade already exists for this quiz."
                );
            }


            grade.setQuiz(quiz);
        }


        return gradeRepository.save(grade);
    }


    // =====================================================
    // SAVE / UPDATE QUIZ GRADE
    // =====================================================
    //
    // Automatically called after quiz submission.
    //
    // If grade does not exist:
    //     CREATE grade
    //
    // If grade already exists:
    //     UPDATE grade
    //
    // Grade uses Double for score/maxScore.
    // =====================================================

    public Grade saveQuizGrade(
            Long studentId,
            Long quizId,
            Double score,
            Double maxScore
    ) {

        // =================================================
        // FIND STUDENT
        // =================================================

        User student =
                userRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );


        // =================================================
        // FIND QUIZ
        // =================================================

        Quiz quiz =
                quizRepository.findById(quizId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Quiz not found"
                                )
                        );


        // =================================================
        // FIND EXISTING GRADE
        // =================================================

        Grade grade =
                gradeRepository
                        .findByStudentIdAndQuizId(
                                studentId,
                                quizId
                        )
                        .orElse(null);


        // =================================================
        // CREATE NEW GRADE
        // =================================================

        if (grade == null) {

            grade = new Grade();

            grade.setStudent(student);

            grade.setQuiz(quiz);

            System.out.println(
                    "Creating new quiz grade."
            );

        } else {

            System.out.println(
                    "Updating existing quiz grade."
            );
        }


        // =================================================
        // SCORE
        // =================================================

        grade.setScore(
                score != null
                        ? score
                        : 0.0
        );


        // =================================================
        // MAX SCORE
        // =================================================

        Double finalMaxScore =
                maxScore;


        if (finalMaxScore == null) {

            finalMaxScore =
                    quiz.getTotalMarks() != null
                            ? quiz.getTotalMarks().doubleValue()
                            : 0.0;
        }


        grade.setMaxScore(
                finalMaxScore
        );


        // =================================================
        // REMARKS
        // =================================================

        grade.setRemarks(
                "Automatically graded from quiz attempt."
        );


        // =================================================
        // SAVE
        // =================================================

        Grade savedGrade =
                gradeRepository.save(grade);


        // =================================================
        // DEBUG
        // =================================================

        System.out.println(
                "===================================="
        );

        System.out.println(
                "QUIZ GRADE SAVED"
        );

        System.out.println(
                "Grade ID: "
                        + savedGrade.getId()
        );

        System.out.println(
                "Student ID: "
                        + studentId
        );

        System.out.println(
                "Quiz ID: "
                        + quizId
        );

        System.out.println(
                "Score: "
                        + savedGrade.getScore()
        );

        System.out.println(
                "Max Score: "
                        + savedGrade.getMaxScore()
        );

        System.out.println(
                "===================================="
        );


        return savedGrade;
    }


    // =====================================================
    // UPDATE GRADE
    // =====================================================

    public Grade updateGrade(
            Long id,
            Grade updatedGrade
    ) {

        Grade grade =
                gradeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Grade not found"
                                )
                        );


        grade.setScore(
                updatedGrade.getScore()
        );

        grade.setMaxScore(
                updatedGrade.getMaxScore()
        );

        grade.setRemarks(
                updatedGrade.getRemarks()
        );


        return gradeRepository.save(grade);
    }


    // =====================================================
    // DELETE GRADE
    // =====================================================

    public void deleteGrade(
            Long id
    ) {

        Grade grade =
                gradeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Grade not found"
                                )
                        );


        gradeRepository.delete(grade);
    }


    // =====================================================
    // GET ALL GRADES
    // =====================================================

    public List<Grade> getAllGrades() {

        return gradeRepository.findAll();
    }


    // =====================================================
    // GET GRADE BY ID
    // =====================================================

    public Grade getGradeById(
            Long id
    ) {

        return gradeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Grade not found"
                        )
                );
    }


    // =====================================================
    // GET STUDENT GRADES
    // =====================================================

    public List<Grade> getStudentGrades(
            Long studentId
    ) {

        return gradeRepository.findByStudentId(
                studentId
        );
    }


    // =====================================================
    // GET ASSIGNMENT GRADES
    // =====================================================

    public List<Grade> getAssignmentGrades(
            Long assignmentId
    ) {

        return gradeRepository.findByAssignmentId(
                assignmentId
        );
    }


    // =====================================================
    // GET QUIZ GRADES
    // =====================================================

    public List<Grade> getQuizGrades(
            Long quizId
    ) {

        return gradeRepository.findByQuizId(
                quizId
        );
    }


    // =====================================================
    // CALCULATE PERCENTAGE
    // =====================================================

    public double calculatePercentage(
            Long id
    ) {

        Grade grade =
                getGradeById(id);


        if (
                grade.getMaxScore() == null
                || grade.getMaxScore() == 0
        ) {

            return 0;
        }


        if (grade.getScore() == null) {

            return 0;
        }


        return (
                grade.getScore()
                        / grade.getMaxScore()
        ) * 100;
    }
}