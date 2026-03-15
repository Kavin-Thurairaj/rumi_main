package com.rumi.rumi_backend_v2.repo;


import com.rumi.rumi_backend_v2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, String> {

}
