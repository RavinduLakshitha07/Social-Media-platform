package backend.Achievements.repository;

import backend.Achievements.model.AchievementsModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementsRepository extends MongoRepository<AchievementsModel, String> {
    void deleteByPostOwnerID(String postOwnerID); // Ensure this method exists
    List<AchievementsModel> findByPostOwnerID(String postOwnerID);
}
