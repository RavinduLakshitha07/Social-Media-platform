package backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
            .cors().and()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/login/**",
                                "/user/**",
                                "/posts/**",
                                "/media/**",
                                "/sendVerificationCode/**",
                                "/uploads/profile/**",
                                "/learningPlan/**",
                                "/achievements/**",
                    "/notifications/**",
                    "/error"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
            .exceptionHandling(exception -> exception
                .defaultAuthenticationEntryPointFor((request, response, authException) -> {
                    response.sendRedirect("/error?message=" + 
                        java.net.URLEncoder.encode("Authentication failed: " + authException.getMessage(), 
                        java.nio.charset.StandardCharsets.UTF_8));
                }, new AntPathRequestMatcher("/**"))
                );
        
        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
