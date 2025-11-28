package com.Rushil.HostelAllocation.Repository;

import com.Rushil.HostelAllocation.Entities.Hostel;
import com.Rushil.HostelAllocation.Entities.Student;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends CrudRepository<Student, Integer> {
    @Query("SELECT s FROM Student s WHERE s.st_id NOT IN (SELECT h.student.st_id FROM Hostel h where h.student.st_id is not null)")
    List<Student> findStudentsWithoutHostel();

    Optional<Student> findByEmail(String email);

    @Query("SELECT s FROM Student s LEFT JOIN Hostel h ON s.st_id = h.student.st_id WHERE s.email = ?1")
    Student findStudentByEmail(String email);

    @Query("SELECT h FROM Student s LEFT JOIN Hostel h ON s.st_id = h.student.st_id WHERE s.email = ?1")
    Hostel findHostelByEmail(String email);
}
