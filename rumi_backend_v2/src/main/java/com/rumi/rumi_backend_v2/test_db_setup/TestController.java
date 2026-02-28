package com.rumi.rumi_backend_v2.test_db_setup;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    private final JdbcTemplate jdbcTemplate;

    public TestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ✅ Get all tables with error handling
    @GetMapping("/postgres/tables")
    public Map<String, Object> showTables() {
        try {
            List<String> tables = jdbcTemplate.queryForList(
                    "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'",
                    String.class
            );
            return Map.of(
                    "status", "success",
                    "tables", tables
            );
        } catch (Exception e) {
            return Map.of(
                    "status", "error",
                    "message", e.getMessage()
            );
        }
    }

    // ✅ Get current database name with error handling
    @GetMapping("/postgres/database")
    public Map<String, Object> currentDatabase() {
        try {
            String dbName = jdbcTemplate.queryForObject(
                    "SELECT current_database()",
                    String.class
            );
            return Map.of(
                    "status", "success",
                    "database", dbName
            );
        } catch (Exception e) {
            return Map.of(
                    "status", "error",
                    "message", e.getMessage()
            );
        }
    }
}