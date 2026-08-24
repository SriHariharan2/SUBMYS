package backend.repository;

import backend.entity.CourseChatSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseChatSettingRepository
        extends JpaRepository<CourseChatSetting, Long> {

    Optional<CourseChatSetting>
    findByCourseId(Long courseId);
}