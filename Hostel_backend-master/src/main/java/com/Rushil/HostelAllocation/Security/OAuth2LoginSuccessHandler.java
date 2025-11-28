package com.Rushil.HostelAllocation.Security;

import com.Rushil.HostelAllocation.helper.JWTHelper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JWTHelper jwtHelper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Extract user information from Google OAuth2
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Check if email starts with "rushil"
        if (email != null && email.startsWith("rushil")) {
            // Generate JWT token using the email as username
            String jwtToken = jwtHelper.generateToken(email);

            // Redirect to frontend with JWT token
            String redirectUrl = String.format("http://localhost:3000/auth/callback?token=%s&email=%s&name=%s",
                    jwtToken, email, name);

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } else {
            // Invalid User: Redirect to Login Page with Error
            String redirectUrl = "http://localhost:3000/?error=unauthorized_email";
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        }
    }
}
