package backend.LearningPlan.controller;

import backend.exception.ResourceNotFoundException;
import backend.LearningPlan.model.LearningPlanModel;
import backend.Notification.model.NotificationModel;
import backend.LearningPlan.repository.LearningPlanRepository;
import backend.Notification.repository.NotificationRepository;
import backend.User.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.scheduling.annotation.Scheduled;
import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")
public class LearningPlanController {
    @Autowired
    private LearningPlanRepository learningPlanRepository;
    private final Path root = Paths.get("uploads/plan");
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostConstruct
    public void init() {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    //Insert
    @PostMapping("/learningPlan")//create new learning plan
    public LearningPlanModel newLearningSystemModel(@RequestBody LearningPlanModel newLearningPlanModel) {
        System.out.println("Received data: " + newLearningPlanModel); // Debugging line
        if (newLearningPlanModel.getPostOwnerID() == null || newLearningPlanModel.getPostOwnerID().isEmpty()) {
            throw new IllegalArgumentException("PostOwnerID is required."); // Ensure postOwnerID is provided
        }
        // Fetch user's full name from UserRepository
        String postOwnerName = userRepository.findById(newLearningPlanModel.getPostOwnerID())
                .map(user -> user.getFullname())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for ID: " + newLearningPlanModel.getPostOwnerID()));
        newLearningPlanModel.setPostOwnerName(postOwnerName);

        // Set current date and time
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        newLearningPlanModel.setCreatedAt(currentDateTime);

        return learningPlanRepository.save(newLearningPlanModel); 
    }

    @PostMapping("/learningPlan/planUpload")//upload plan image
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File is empty or null");
            }

            // Log file details
            System.out.println("File name: " + file.getOriginalFilename());
            System.out.println("File size: " + file.getSize());
            System.out.println("File content type: " + file.getContentType());

            // Create directory if it doesn't exist
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            // Get file extension
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                throw new IllegalArgumentException("Original filename is null");
            }

            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID() + extension;

            // Log the full path where we're trying to save
            Path targetPath = this.root.resolve(filename);
            System.out.println("Saving file to: " + targetPath.toAbsolutePath());

            // Save the file
            Files.copy(file.getInputStream(), targetPath);

            System.out.println("File uploaded successfully: " + filename);
            return filename;
        } catch (Exception e) {
            System.err.println("Error uploading file: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    @GetMapping("/learningPlan")//get all learning plans
    List<LearningPlanModel> getAll() {
        List<LearningPlanModel> posts = learningPlanRepository.findAll();
        posts.forEach(post -> {
            if (post.getPostOwnerID() != null) {
                String postOwnerName = userRepository.findById(post.getPostOwnerID())
                        .map(user -> user.getFullname())
                        .orElse("Unknown User");
                post.setPostOwnerName(postOwnerName);
            }
        });
        return posts;
    }

    @GetMapping("/learningPlan/{id}")//get learning plan by id
    LearningPlanModel getById(@PathVariable String id) {
        LearningPlanModel post = learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        if (post.getPostOwnerID() != null) {
            String postOwnerName = userRepository.findById(post.getPostOwnerID())
                    .map(user -> user.getFullname())
                    .orElse("Unknown User");
            post.setPostOwnerName(postOwnerName);
        }
        return post;
    }

    @PutMapping("/learningPlan/{id}")//update learning plan
    LearningPlanModel update(@RequestBody LearningPlanModel newLearningPlanModel, @PathVariable String id) {
        return learningPlanRepository.findById(id)
                .map(learningPlanModel -> {
                    learningPlanModel.setTitle(newLearningPlanModel.getTitle());
                    learningPlanModel.setDescription(newLearningPlanModel.getDescription());


                       // Update endDate
                    learningPlanModel.setCategory(newLearningPlanModel.getCategory());  // Update category
                    
                    if (newLearningPlanModel.getPostOwnerID() != null && !newLearningPlanModel.getPostOwnerID().isEmpty()) {
                        learningPlanModel.setPostOwnerID(newLearningPlanModel.getPostOwnerID());
                        // Fetch and update the real name of the post owner
                        String postOwnerName = userRepository.findById(newLearningPlanModel.getPostOwnerID())
                                .map(user -> user.getFullname())
                                .orElseThrow(() -> new ResourceNotFoundException("User not found for ID: " + newLearningPlanModel.getPostOwnerID()));
                        learningPlanModel.setPostOwnerName(postOwnerName);
                    }
                    

                    return learningPlanRepository.save(learningPlanModel);
                }).orElseThrow(() -> new ResourceNotFoundException(id));
    }

    @DeleteMapping("/learningPlan/{id}")//delete learning plan
    public void delete(@PathVariable String id) {
        learningPlanRepository.deleteById(id);
    }

    @GetMapping("/learningPlan/planImages/{filename:.+}")//get uploaded
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Error loading image: " + e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    public void sendExpiryNotifications() {
        List<LearningPlanModel> plans = learningPlanRepository.findAll();
        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));






    }
}
