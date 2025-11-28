package com.Rushil.HostelAllocation.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.Optional;


@Entity(name = "Student")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Student {

    @Id
    @Column(name = "student_id", unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int st_id;

    @Column(name = "roll_no", unique = true)
    private int roll;

    @Column(name = "first_name")
    private String fname;

    @Column(name = "last_name")
    private String lname;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "photograph_path")
    private String photo;

    @Column(name = "cgpa")
    private double cgpa = 0.0;

    @Column(name = "total_credits")
    private int credit;

    @Column(name = "graduation_year")
    private int year;
}