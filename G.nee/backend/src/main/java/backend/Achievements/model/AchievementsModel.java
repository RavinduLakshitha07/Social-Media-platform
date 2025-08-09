package backend.Achievements.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "achievements")
public class AchievementsModel {
    @Id
    private String id;
    private String title;
    private String description;
    private String date;
    private String category;
    private String postOwnerID;
    private String postOwnerName;

    public AchievementsModel() {
    }

    public AchievementsModel(String title, String description, String date, String category, String postOwnerID, String postOwnerName) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.category = category;
        this.postOwnerID = postOwnerID;
        this.postOwnerName = postOwnerName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPostOwnerID() {
        return postOwnerID;
    }

    public void setPostOwnerID(String postOwnerID) {
        this.postOwnerID = postOwnerID;
    }

    public String getPostOwnerName() {
        return postOwnerName;
    }

    public void setPostOwnerName(String postOwnerName) {
        this.postOwnerName = postOwnerName;
    }
}
