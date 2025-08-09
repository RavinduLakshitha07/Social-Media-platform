package backend.Achievements.controller;

import backend.Achievements.model.AchievementsModel;
import backend.Achievements.repository.AchievementsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/achievements")
@CrossOrigin(origins = "http://localhost:3000")
public class AchievementsController {

    @Autowired
    private AchievementsRepository achievementsRepository;

    @PostMapping
    public ResponseEntity<AchievementsModel> createAchievement(@RequestBody AchievementsModel achievement) {
        AchievementsModel savedAchievement = achievementsRepository.save(achievement);
        return ResponseEntity.ok(savedAchievement);
    }

    @GetMapping
    public ResponseEntity<List<AchievementsModel>> getAllAchievements() {
        List<AchievementsModel> achievements = achievementsRepository.findAll();
        return ResponseEntity.ok(achievements);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AchievementsModel> getAchievementById(@PathVariable String id) {
        Optional<AchievementsModel> achievement = achievementsRepository.findById(id);
        return achievement.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AchievementsModel> updateAchievement(@PathVariable String id, @RequestBody AchievementsModel achievement) {
        if (!achievementsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        achievement.setId(id);
        AchievementsModel updatedAchievement = achievementsRepository.save(achievement);
        return ResponseEntity.ok(updatedAchievement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable String id) {
        if (!achievementsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        achievementsRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{postOwnerID}")
    public ResponseEntity<List<AchievementsModel>> getAchievementsByUserId(@PathVariable String postOwnerID) {
        List<AchievementsModel> achievements = achievementsRepository.findByPostOwnerID(postOwnerID);
        return ResponseEntity.ok(achievements);
    }
}
