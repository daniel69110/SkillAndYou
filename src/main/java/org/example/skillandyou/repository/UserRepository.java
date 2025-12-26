package org.example.skillandyou.repository;

import org.example.skillandyou.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
