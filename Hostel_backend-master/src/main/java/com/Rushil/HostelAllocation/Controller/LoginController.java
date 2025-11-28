package com.Rushil.HostelAllocation.Controller;

import com.Rushil.HostelAllocation.DTO.LoginDTO;
import com.Rushil.HostelAllocation.Entities.Student;
import com.Rushil.HostelAllocation.Repository.StudentRepository;
import com.Rushil.HostelAllocation.helper.JWTHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class LoginController {

    private final JWTHelper jwtHelper;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginController(JWTHelper jwtHelper) {
        this.jwtHelper = jwtHelper;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        String who = loginDTO.getWho();
        String email = loginDTO.getEmail();
        String password = loginDTO.getPassword();

        try {
            if (who == null || email == null || password == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            if (who.equals("admin")) {
                String adminEmail = "admin@iiitb.ac.in";
                String adminEncodedPassword = "$2a$10$zl/grlqw8ERKwYoIBVDk3.0AlxyQ/NtDf8M4twiHy2tJ/3d/NknOq"; // Admin@123

                if (adminEmail.equals(email) && passwordEncoder.matches("Admin@123", adminEncodedPassword)) {
                    String token = jwtHelper.generateToken(email);
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("role", "admin");
                    response.put("email", email);
                    return ResponseEntity.ok(response);
                }
            } else if (who.equals("student")) {
                Optional<Student> studentOpt = studentRepository.findByEmail(email);
                if (studentOpt.isPresent()) {
                    Student student = studentOpt.get();
                    String storedPassword = student.getPassword();

                    // Debug output
                    System.out.println("Student found with email: " + email);
                    System.out.println("Stored password hash: " + storedPassword);
                    System.out.println("Input password: " + password);

                    // Check if the stored password is already hashed (starts with $2a$)
                    boolean isHashed = storedPassword != null && storedPassword.startsWith("$2a$");
                    boolean passwordMatches = isHashed ? passwordEncoder.matches(password, storedPassword)
                            : password.equals(storedPassword);

                    System.out.println("Password is hashed: " + isHashed);
                    System.out.println("Password matches: " + passwordMatches);

                    if (storedPassword != null && passwordMatches) {
                        String token = jwtHelper.generateToken(email);
                        Map<String, Object> response = new HashMap<>();
                        response.put("token", token);
                        response.put("role", "student");
                        response.put("email", email);
                        response.put("studentId", student.getSt_id());
                        return ResponseEntity.ok(response);
                    }
                }
            } else {
                return ResponseEntity.badRequest().body("Invalid user type. Must be 'admin' or 'student'");
            }

            return ResponseEntity.status(401).body("Invalid email or password");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred during login: " + e.getMessage());
        }
    }

    @GetMapping("/test-connection")
    public ResponseEntity<String> testConnection() {
        try {
            studentRepository.count(); // Check DB connection
            return ResponseEntity.ok("Backend and Database are running!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Database not connected");
        }
    }
}
