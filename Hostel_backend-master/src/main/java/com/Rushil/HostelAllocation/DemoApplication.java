package com.Rushil.HostelAllocation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
// @EnableJpaRepositories("com.example.HostelAllocation.Repository")
@EnableJpaRepositories("com.Rushil.HostelAllocation.Repository")

// @SpringBootApplication(exclude = {SecurityAutoConfiguration.class}) // we
// dissable the security so that we can make and execute hte program at thesame
// time

public class DemoApplication {

    public static void main(String[] args) {

        SpringApplication.run(DemoApplication.class, args);
    }

}
