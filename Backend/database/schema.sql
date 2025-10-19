-- Create database if not exists (run separately)
-- CREATE DATABASE IF NOT EXISTS compiler-errors-kbs;
-- USE compiler-kbs;

-- Errors table
CREATE TABLE IF NOT EXISTS errors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query TEXT NOT NULL,
    solution TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert sample data
INSERT INTO errors (query, solution) VALUES 
('Python indentation error', 'This is usually due to inconsistent spaces/tabs. Use 4 spaces per indent level. Check your code editor settings.'),
('C++ segmentation fault', 'Likely null pointer dereference. Use debugger (gdb) to trace. Ensure pointers are initialized.');

-- View table
-- SELECT * FROM errors;
ALTER TABLE errors 
ADD COLUMN error_message TEXT NOT NULL AFTER id,
ADD COLUMN language VARCHAR(50) DEFAULT 'Unknown',
ADD COLUMN source VARCHAR(50) DEFAULT 'Gemini';

-- Optional: Rename 'query' to 'error_message' and remove old column
-- ALTER TABLE errors DROP COLUMN query;