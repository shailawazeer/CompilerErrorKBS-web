-- First, check if the table exists and what it looks like
DESCRIBE errors;

-- Drop the table and recreate it properly
DROP TABLE IF EXISTS errors;

-- Create the table with correct structure
CREATE TABLE IF NOT EXISTS errors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query TEXT NOT NULL,
    solution TEXT NOT NULL,
    error_message TEXT,
    language VARCHAR(50) DEFAULT 'Unknown',
    source VARCHAR(50) DEFAULT 'Gemini',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO errors (query, solution) VALUES 
('Python indentation error', 'This is usually due to inconsistent spaces/tabs. Use 4 spaces per indent level. Check your code editor settings.'),
('C++ segmentation fault', 'Likely null pointer dereference. Use debugger (gdb) to trace. Ensure pointers are initialized.');