package com.rumi.rumi_backend_v2.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rumi.rumi_backend_v2.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}
