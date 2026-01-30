package org.example.skillandyou;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SkillAndYouApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillAndYouApplication.class, args);
    }

}
