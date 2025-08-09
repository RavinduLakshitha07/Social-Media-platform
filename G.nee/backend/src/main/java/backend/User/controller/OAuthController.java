package backend.User.controller;

import backend.User.model.UserModel;
import backend.User.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
public class OAuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/oauth2/success")
    public RedirectView handleGoogleLogin(Authentication authentication) {
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oAuth2User.getAttributes();
            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String googleProfileImage = (String) attributes.get("picture");

            if (email == null || name == null) {
                throw new IllegalStateException("Required OAuth2 attributes are missing");
            }

            // Encode the Google profile image URL
            String encodedGoogleProfileImage = URLEncoder.encode(googleProfileImage, StandardCharsets.UTF_8);

            UserModel user;
            // Check if user already exists
            if (!userRepository.existsByEmail(email)) {
                user = new UserModel();
                user.setEmail(email);
                user.setFullname(name);
                user.setGoogleProfileImage(googleProfileImage);
                userRepository.save(user);
            } else {
                user = userRepository.findByEmail(email).orElseThrow(() -> 
                    new IllegalStateException("User not found despite existence check"));
            }

            String redirectUrl = String.format(
                "http://localhost:3000/oauth2/success?userID=%s&name=%s&googleProfileImage=%s",
                user.getId().toString(),
                URLEncoder.encode(user.getFullname(), StandardCharsets.UTF_8),
                encodedGoogleProfileImage
            );

            return new RedirectView(redirectUrl);
        } catch (Exception e) {
            // Log the error and redirect to an error page
            e.printStackTrace();
            return new RedirectView("http://localhost:3000/error?message=" + 
                URLEncoder.encode("Authentication failed: " + e.getMessage(), StandardCharsets.UTF_8));
        }
    }
}
