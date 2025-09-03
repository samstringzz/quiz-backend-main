-- Insert demo user
INSERT INTO users (email, password_hash) VALUES
('demo@example.com', '$2b$10$1234567890123456789012uQGxXF8aMX8RyF8wQwT8XzR8L8L8L8L8'); -- Password: demo123

-- Insert sample questions
INSERT INTO questions (question_text, option_1, option_2, option_3, option_4, correct_option, created_by) VALUES
('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 3, 1),
('Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 2, 1),
('What is the largest mammal in the world?', 'African Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus', 2, 1),
('Who painted the Mona Lisa?', 'Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo', 3, 1),
('What is the chemical symbol for gold?', 'Ag', 'Fe', 'Au', 'Cu', 3, 1),
('Which programming language was created by James Gosling?', 'Python', 'Java', 'C++', 'JavaScript', 2, 1),
('What is the largest organ in the human body?', 'Heart', 'Brain', 'Liver', 'Skin', 4, 1),
('Who wrote "Romeo and Juliet"?', 'Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain', 2, 1),
('What is the capital of Japan?', 'Seoul', 'Beijing', 'Tokyo', 'Bangkok', 3, 1),
('Which element has the atomic number 1?', 'Helium', 'Hydrogen', 'Carbon', 'Oxygen', 2, 1);
