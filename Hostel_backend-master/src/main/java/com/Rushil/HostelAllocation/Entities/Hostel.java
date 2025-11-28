package com.Rushil.HostelAllocation.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "Hostel")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Hostel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "floor", nullable = false)
    private int floor;

    @Column(name = "room_number", unique = true, nullable = false)
    private String room;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;

}
