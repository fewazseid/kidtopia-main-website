-- Child table
CREATE TABLE Child (
    ChildID INT IDENTITY PRIMARY KEY,
    Name VARCHAR(100),
    DateOfBirth DATE,
    Gender VARCHAR(10),
    MedicalInfo VARCHAR(MAX),
    Allergies VARCHAR(MAX),
    DietaryRequirements VARCHAR(MAX),
    GuardianID INT
);

-- Guardian table
CREATE TABLE Guardian (
    GuardianID INT IDENTITY PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    RelationshipToChild VARCHAR(50),
    Password VARCHAR(100),
    PhoneNo VARCHAR(20),
    ChildID INT
);

-- Admin table
CREATE TABLE Admin (
    AdminID INT IDENTITY PRIMARY KEY,
    Name VARCHAR(100),
    Role VARCHAR(50),
    Email VARCHAR(100),
    Password VARCHAR(100),
    StaffID INT
);

-- Staff table
CREATE TABLE Staff (
    StaffID INT IDENTITY PRIMARY KEY,
    Name VARCHAR(100),
    Role VARCHAR(50),
    Email VARCHAR(100),
    Password VARCHAR(100),
    PhoneNo VARCHAR(20),
    AdminID INT
);

-- Invoice table
CREATE TABLE Invoice (
    InvoiceID INT IDENTITY PRIMARY KEY,
    BillingPeriod VARCHAR(50),
    Amount DECIMAL(10, 2),
    PaymentStatus VARCHAR(20),
    ChildID INT
);

-- Attendance table
CREATE TABLE Attendance (
    AttendanceID INT IDENTITY PRIMARY KEY,
    CheckIn DATETIME,
    CheckOut DATETIME,
    ChildID INT
);

-- EmergencyContact table
CREATE TABLE EmergencyContact (
    EmergencyContactID INT IDENTITY PRIMARY KEY,
    Name VARCHAR(100),
    RelationshipToChild VARCHAR(50),
    Email VARCHAR(100),
    PhoneNo VARCHAR(20),
    ChildID INT
);

-- Communication table
CREATE TABLE Communication (
    CommunicationID INT IDENTITY PRIMARY KEY,
    CommunicationChannel VARCHAR(50),
    Message VARCHAR(MAX),
    Timestamp DATETIME,
    Feedback VARCHAR(MAX),
    GuardianID INT,
    StaffID INT
);




INSERT INTO Child (Name, DateOfBirth, Gender, MedicalInfo, Allergies, DietaryRequirements, GuardianID)
VALUES 
('Emma Johnson', '2018-05-15', 'Female', 'None', 'None', 'None', 1),
('Noah Smith', '2017-09-20', 'Male', 'None', 'Peanuts', 'None', 2),
('Olivia Williams', '2019-02-10', 'Female', 'None', 'Dairy', 'None', 3),
('Liam Jones', '2016-07-25', 'Male', 'None', 'None', 'Vegetarian', 4),
('Sophia Brown', '2017-12-05', 'Female', 'None', 'Pollen', 'None', 5),
('William Taylor', '2018-08-12', 'Male', 'None', 'Shellfish', 'None', 6),
('Isabella Martinez', '2017-04-30', 'Female', 'Asthma', 'None', 'None', 7),
('James Wilson', '2019-11-03', 'Male', 'None', 'Eggs', 'None', 8),
('Sophia Garcia', '2016-06-18', 'Female', 'None', 'None', 'Halal', 9),
('Logan Rodriguez', '2018-01-22', 'Male', 'None', 'Dairy', 'None', 10),
('Emma Hernandez', '2017-05-09', 'Female', 'None', 'None', 'None', 11),
('Alexander Lopez', '2019-09-14', 'Male', 'None', 'None', 'Vegetarian', 12),
('Mia Gonzalez', '2016-12-17', 'Female', 'None', 'Peanuts', 'None', 13),
('Ethan Perez', '2018-03-28', 'Male', 'None', 'None', 'None', 14),
('Ava Torres', '2017-10-01', 'Female', 'None', 'Dairy', 'None', 15),
('Michael Rivera', '2019-07-05', 'Male', 'None', 'None', 'None', 16),
('Amelia Flores', '2016-04-14', 'Female', 'None', 'Pollen', 'None', 17),
('William Cruz', '2018-11-19', 'Male', 'None', 'Peanuts', 'None', 18),
('Sophia Ortiz', '2017-08-23', 'Female', 'None', 'None', 'None', 19),
('Logan Gomez', '2019-02-26', 'Male', 'None', 'Dairy', 'None', 20),
('Olivia Sanchez', '2016-10-07', 'Female', 'None', 'None', 'Vegetarian', 21),
('Mason Torres', '2018-05-12', 'Male', 'None', 'Shellfish', 'None', 22),
('Isabella Jimenez', '2017-01-15', 'Female', 'Asthma', 'None', 'None', 23),
('Elijah Vazquez', '2019-06-28', 'Male', 'None', 'Eggs', 'None', 24),
('Avery Ramos', '2016-03-21', 'Female', 'None', 'None', 'Halal', 25);


INSERT INTO Guardian (Name, Email, RelationshipToChild, Password, PhoneNo, ChildID)
VALUES
('John Doe', 'john@example.com', 'Father', 'password1', '123-456-7890', 1),
('Jane Smith', 'jane@example.com', 'Mother', 'password2', '234-567-8901', 2),
('Michael Johnson', 'michael@example.com', 'Father', 'password3', '345-678-9012', 3),
('Emily Brown', 'emily@example.com', 'Mother', 'password4', '456-789-0123', 4),
('David Wilson', 'david@example.com', 'Father', 'password5', '567-890-1234', 5),
('Emily Johnson', 'emily@example.com', 'Mother', 'password6', '678-901-2345', 6),
('Michael Smith', 'michael@example.com', 'Father', 'password7', '789-012-3456', 7),
('Sophia Williams', 'sophia@example.com', 'Mother', 'password8', '890-123-4567', 8),
('Daniel Jones', 'daniel@example.com', 'Father', 'password9', '901-234-5678', 9),
('Olivia Brown', 'olivia@example.com', 'Mother', 'password10', '012-345-6789', 10),
('James Davis', 'james@example.com', 'Father', 'password11', '123-456-7890', 11),
('Amelia Miller', 'amelia@example.com', 'Mother', 'password12', '234-567-8901', 12),
('Benjamin Wilson', 'benjamin@example.com', 'Father', 'password13', '345-678-9012', 13),
('Charlotte Garcia', 'charlotte@example.com', 'Mother', 'password14', '456-789-0123', 14),
('Lucas Rodriguez', 'lucas@example.com', 'Father', 'password15', '567-890-1234', 15),
('Ella Martinez', 'ella@example.com', 'Mother', 'password16', '678-901-2345', 16),
('William Lopez', 'william@example.com', 'Father', 'password17', '789-012-3456', 17),
('Sophia Perez', 'sophia@example.com', 'Mother', 'password18', '890-123-4567', 18),
('Jacob Hernandez', 'jacob@example.com', 'Father', 'password19', '901-234-5678', 19),
('Evelyn Gonzales', 'evelyn@example.com', 'Mother', 'password20', '012-345-6789', 20),
('Alexander Nelson', 'alexander@example.com', 'Father', 'password21', '123-456-7890', 21),
('Madison Carter', 'madison@example.com', 'Mother', 'password22', '234-567-8901', 22),
('Ethan Moore', 'ethan@example.com', 'Father', 'password23', '345-678-9012', 23),
('Ava King', 'ava@example.com', 'Mother', 'password24', '456-789-0123', 24),
('Liam Price', 'liam@example.com', 'Father', 'password25', '567-890-1234', 25);



INSERT INTO Admin (Name, Role, Email, Password, StaffID)
VALUES 
('Admin1', 'Administrator', 'admin1@example.com', 'adminpassword1', 1),
('Admin2', 'Administrator', 'admin2@example.com', 'adminpassword2', 2),
('Admin3', 'Administrator', 'admin3@example.com', 'adminpassword3', 3),
('Admin4', 'Administrator', 'admin4@example.com', 'adminpassword4', 4),
('Admin5', 'Administrator', 'admin5@example.com', 'adminpassword5', 5),
('Emily Johnson', 'Administrator', 'emily@example.com', 'adminpassword6', 6),
('Michael Smith', 'Administrator', 'michael@example.com', 'adminpassword7', 7),
('Sophia Williams', 'Administrator', 'sophia@example.com', 'adminpassword8', 8),
('Daniel Jones', 'Administrator', 'daniel@example.com', 'adminpassword9', 9),
('Olivia Brown', 'Administrator', 'olivia@example.com', 'adminpassword10', 10),
('James Davis', 'Administrator', 'james@example.com', 'adminpassword11', 11),
('Amelia Miller', 'Administrator', 'amelia@example.com', 'adminpassword12', 12),
('Benjamin Wilson', 'Administrator', 'benjamin@example.com', 'adminpassword13', 13),
('Charlotte Garcia', 'Administrator', 'charlotte@example.com', 'adminpassword14', 14),
('Lucas Rodriguez', 'Administrator', 'lucas@example.com', 'adminpassword15', 15),
('Ella Martinez', 'Administrator', 'ella@example.com', 'adminpassword16', 16),
('William Lopez', 'Administrator', 'william@example.com', 'adminpassword17', 17),
('Sophia Perez', 'Administrator', 'sophia@example.com', 'adminpassword18', 18),
('Jacob Hernandez', 'Administrator', 'jacob@example.com', 'adminpassword19', 19),
('Evelyn Gonzales', 'Administrator', 'evelyn@example.com', 'adminpassword20', 20),
('Alexander Nelson', 'Administrator', 'alexander@example.com', 'adminpassword21', 21),
('Madison Carter', 'Administrator', 'madison@example.com', 'adminpassword22', 22),
('Ethan Moore', 'Administrator', 'ethan@example.com', 'adminpassword23', 23),
('Ava King', 'Administrator', 'ava@example.com', 'adminpassword24', 24),
('Liam Price', 'Administrator', 'liam@example.com', 'adminpassword25', 25);


INSERT INTO Staff (Name, Role, Email, Password, PhoneNo, AdminID)
VALUES 
('Emily Johnson', 'Teacher', 'emily.johnson@example.com', 'teacheremily123', '123-456-7890', 1),
('James Smith', 'Assistant', 'james.smith@example.com', 'assistantjames456', '234-567-8901', 2),
('Olivia Williams', 'Teacher', 'olivia.williams@example.com', 'teacherolivia789', '345-678-9012', 3),
('Liam Jones', 'Assistant', 'liam.jones@example.com', 'assistantliam123', '456-789-0123', 4),
('Sophia Brown', 'Teacher', 'sophia.brown@example.com', 'teachersophia456', '567-890-1234', 5),
('William Taylor', 'Teacher', 'william.taylor@example.com', 'teacherwilliam123', '678-901-2345', 6),
('Isabella Martinez', 'Assistant', 'isabella.martinez@example.com', 'assistantisabella456', '789-012-3456', 7),
('James Wilson', 'Teacher', 'james.wilson@example.com', 'teacherjames789', '890-123-4567', 8),
('Sophia Garcia', 'Assistant', 'sophia.garcia@example.com', 'assistantsophia123', '901-234-5678', 9),
('Logan Rodriguez', 'Teacher', 'logan.rodriguez@example.com', 'teacherlogan456', '012-345-6789', 10),
('Emma Hernandez', 'Assistant', 'emma.hernandez@example.com', 'assistantemma123', '123-456-7890', 11),
('Alexander Lopez', 'Teacher', 'alexander.lopez@example.com', 'teacheralexander456', '234-567-8901', 12),
('Mia Gonzalez', 'Assistant', 'mia.gonzalez@example.com', 'assistantmia123', '345-678-9012', 13),
('Ethan Perez', 'Teacher', 'ethan.perez@example.com', 'teacherethan456', '456-789-0123', 14),
('Ava Torres', 'Assistant', 'ava.torres@example.com', 'assistantava123', '567-890-1234', 15),
('Michael Rivera', 'Teacher', 'michael.rivera@example.com', 'teachermichael456', '678-901-2345', 16),
('Amelia Flores', 'Assistant', 'amelia.flores@example.com', 'assistantamelia123', '789-012-3456', 17),
('William Cruz', 'Teacher', 'william.cruz@example.com', 'teacherwilliam456', '890-123-4567', 18),
('Sophia Ortiz', 'Assistant', 'sophia.ortiz@example.com', 'assistantsophia123', '901-234-5678', 19),
('Logan Gomez', 'Teacher', 'logan.gomez@example.com', 'teacherlogan456', '012-345-6789', 20),
('Olivia Sanchez', 'Assistant', 'olivia.sanchez@example.com', 'assistantolivia123', '123-456-7890', 21),
('Mason Torres', 'Teacher', 'mason.torres@example.com', 'teachermason456', '234-567-8901', 22),
('Isabella Jimenez', 'Assistant', 'isabella.jimenez@example.com', 'assistantisabella123', '345-678-9012', 23),
('Elijah Vazquez', 'Teacher', 'elijah.vazquez@example.com', 'teacherelijah456', '456-789-0123', 24),
('Avery Ramos', 'Assistant', 'avery.ramos@example.com', 'assistantavery123', '567-890-1234', 25);



INSERT INTO Invoice (BillingPeriod, Amount, PaymentStatus, ChildID)
VALUES 
('May 2024', 150.00, 'Paid', 1),
('May 2024', 150.00, 'Pending', 2),
('May 2024', 160.00, 'Paid', 3),
('May 2024', 170.00, 'Pending', 4),
('May 2024', 180.00, 'Paid', 5),
('May 2024', 160.00, 'Pending', 6),
('May 2024', 170.00, 'Paid', 7),
('May 2024', 180.00, 'Pending', 8),
('May 2024', 190.00, 'Paid', 9),
('May 2024', 200.00, 'Pending', 10),
('May 2024', 210.00, 'Paid', 11),
('May 2024', 220.00, 'Pending', 12),
('May 2024', 230.00, 'Paid', 13),
('May 2024', 240.00, 'Pending', 14),
('May 2024', 250.00, 'Paid', 15),
('May 2024', 260.00, 'Pending', 16),
('May 2024', 270.00, 'Paid', 17),
('May 2024', 280.00, 'Pending', 18),
('May 2024', 290.00, 'Paid', 19),
('May 2024', 300.00, 'Pending', 20),
('May 2024', 310.00, 'Paid', 21),
('May 2024', 320.00, 'Pending', 22),
('May 2024', 330.00, 'Paid', 23),
('May 2024', 340.00, 'Pending', 24),
('May 2024', 350.00, 'Paid', 25);


INSERT INTO Attendance (CheckIn, CheckOut, ChildID)
VALUES 
('2024-05-01 08:00:00', '2024-05-01 16:00:00', 1),
('2024-05-01 08:15:00', '2024-05-01 16:15:00', 2),
('2024-05-01 08:30:00', '2024-05-01 16:30:00', 3),
('2024-05-01 08:45:00', '2024-05-01 16:45:00', 4),
('2024-05-01 09:00:00', '2024-05-01 17:00:00', 5),
('2024-05-01 09:15:00', '2024-05-01 17:15:00', 6),
('2024-05-01 09:30:00', '2024-05-01 17:30:00', 7),
('2024-05-01 09:45:00', '2024-05-01 17:45:00', 8),
('2024-05-01 10:00:00', '2024-05-01 18:00:00', 9),
('2024-05-01 10:15:00', '2024-05-01 18:15:00', 10),
('2024-05-01 10:30:00', '2024-05-01 18:30:00', 11),
('2024-05-01 10:45:00', '2024-05-01 18:45:00', 12),
('2024-05-01 11:00:00', '2024-05-01 19:00:00', 13),
('2024-05-01 11:15:00', '2024-05-01 19:15:00', 14),
('2024-05-01 11:30:00', '2024-05-01 19:30:00', 15),
('2024-05-01 11:45:00', '2024-05-01 19:45:00', 16),
('2024-05-01 12:00:00', '2024-05-01 20:00:00', 17),
('2024-05-01 12:15:00', '2024-05-01 20:15:00', 18),
('2024-05-01 12:30:00', '2024-05-01 20:30:00', 19),
('2024-05-01 12:45:00', '2024-05-01 20:45:00', 20),
('2024-05-01 13:00:00', '2024-05-01 21:00:00', 21),
('2024-05-01 13:15:00', '2024-05-01 21:15:00', 22),
('2024-05-01 13:30:00', '2024-05-01 21:30:00', 23),
('2024-05-01 13:45:00', '2024-05-01 21:45:00', 24),
('2024-05-01 14:00:00', '2024-05-01 22:00:00', 25);


INSERT INTO EmergencyContact (Name, RelationshipToChild, Email, PhoneNo, ChildID)
VALUES 
('EmergencyContact1', 'Parent', 'emergency1@example.com', '123-456-7890', 1),
('EmergencyContact2', 'Parent', 'emergency2@example.com', '234-567-8901', 2),
('EmergencyContact3', 'Parent', 'emergency3@example.com', '345-678-9012', 3),
('EmergencyContact4', 'Parent', 'emergency4@example.com', '456-789-0123', 4),
('EmergencyContact5', 'Parent', 'emergency5@example.com', '567-890-1234', 5),
('Emily Johnson', 'Parent', 'emily@example.com', '123-456-7890', 6),
('Michael Smith', 'Parent', 'michael@example.com', '234-567-8901', 7),
('Sophia Williams', 'Parent', 'sophia@example.com', '345-678-9012', 8),
('Daniel Jones', 'Parent', 'daniel@example.com', '456-789-0123', 9),
('Olivia Brown', 'Parent', 'olivia@example.com', '567-890-1234', 10),
('James Davis', 'Parent', 'james@example.com', '678-901-2345', 11),
('Amelia Miller', 'Parent', 'amelia@example.com', '789-012-3456', 12),
('Benjamin Wilson', 'Parent', 'benjamin@example.com', '890-123-4567', 13),
('Charlotte Garcia', 'Parent', 'charlotte@example.com', '901-234-5678', 14),
('Lucas Rodriguez', 'Parent', 'lucas@example.com', '012-345-6789', 15),
('Ella Martinez', 'Parent', 'ella@example.com', '123-456-7890', 16),
('William Lopez', 'Parent', 'william@example.com', '234-567-8901', 17),
('Sophia Perez', 'Parent', 'sophia@example.com', '345-678-9012', 18),
('Jacob Hernandez', 'Parent', 'jacob@example.com', '456-789-0123', 19),
('Evelyn Gonzales', 'Parent', 'evelyn@example.com', '567-890-1234', 20),
('Alexander Nelson', 'Parent', 'alexander@example.com', '678-901-2345', 21),
('Madison Carter', 'Parent', 'madison@example.com', '789-012-3456', 22),
('Ethan Moore', 'Parent', 'ethan@example.com', '890-123-4567', 23),
('Ava King', 'Parent', 'ava@example.com', '901-234-5678', 24),
('Liam Price', 'Parent', 'liam@example.com', '012-345-6789', 25);



INSERT INTO Communication (CommunicationChannel, Message, Timestamp, Feedback, GuardianID, StaffID)
VALUES 
('Email', 'Message 1', '2024-05-01 09:00:00', 'Feedback 1', 1, 1),
('Phone', 'Message 2', '2024-05-01 09:15:00', 'Feedback 2', 2, 2),
('Text', 'Message 3', '2024-05-01 09:30:00', 'Feedback 3', 3, 3),
('Email', 'Message 4', '2024-05-01 09:45:00', 'Feedback 4', 4, 4),
('Phone', 'Message 5', '2024-05-01 10:00:00', 'Feedback 5', 5, 5),
('Email', 'Your child, Emma, had a great day today!', '2024-05-01 10:15:00', 'Thank you for the update!', 6, 6),
('Phone', 'Noah had a little trouble settling in today, but he''s doing better now.', '2024-05-01 10:30:00', 'Thanks for letting me know, we''ll keep an eye on him.', 7, 7),
('Text', 'Olivia seems to be enjoying her time here!', '2024-05-01 10:45:00', 'That''s great to hear!', 8, 8),
('Email', 'Liam had some trouble with his snack today due to his dietary restrictions.', '2024-05-01 11:00:00', 'We''ll make sure to provide suitable alternatives in the future.', 9, 9),
('Phone', 'Sophia was very helpful during our group activities today.', '2024-05-01 11:15:00', 'That''s wonderful to hear!', 10, 10),
('Email', 'James was feeling a bit unwell today.', '2024-05-01 11:30:00', 'Thank you for letting us know, we''ll keep an eye on him.', 11, 11),
('Phone', 'Amelia made some new friends today!', '2024-05-01 11:45:00', 'That''s great news!', 12, 12),
('Text', 'Benjamin seemed a bit tired today, but he still participated in all the activities.', '2024-05-01 12:00:00', 'Thank you for the update, we''ll make sure he gets some rest.', 13, 13),
('Email', 'Charlotte forgot her lunchbox today.', '2024-05-01 12:15:00', 'We''ll make sure she has something to eat.', 14, 14),
('Phone', 'Lucas had a fall during playtime, but he''s okay now.', '2024-05-01 12:30:00', 'Thank you for informing us, we''ll check on him.', 15, 15),
('Text', 'Ella seemed a bit upset when I dropped her off today.', '2024-05-01 12:45:00', 'We''ll keep an eye on her and provide extra attention.', 16, 16),
('Email', 'William lost his favorite toy today.', '2024-05-01 13:00:00', 'We''ll search for it together.', 17, 17),
('Phone', 'Sophia was very enthusiastic during our outdoor activities today.', '2024-05-01 13:15:00', 'That''s wonderful to hear!', 18, 18),
('Text', 'Jacob seems to be adjusting well to the new routine.', '2024-05-01 13:30:00', 'That''s great news!', 19, 19),
('Email', 'Evelyn forgot her jacket today.', '2024-05-01 13:45:00', 'We''ll make sure she stays warm.', 20, 20),
('Phone', 'Alexander had a great time exploring the science activities today.', '2024-05-01 14:00:00', 'That''s fantastic!', 21, 21),
('Text', 'Madison was a bit shy today, but she''s slowly opening up.', '2024-05-01 14:15:00', 'Thank you for the update, we''ll encourage her.', 22, 22),
('Email', 'Ethan seemed tired today.', '2024-05-01 14:30:00', 'We''ll make sure he gets some rest.', 23, 23),
('Phone', 'Ava lost her water bottle today.', '2024-05-01 14:45:00', 'We''ll help her find it.', 24, 24),
('Text', 'Liam was very helpful in cleaning up today.', '2024-05-01 15:00:00', 'That''s great to hear!', 25, 25);







--1. Joining Child and Guardian tables to get the names of children along with their guardian's email:

SELECT c.Name AS ChildName, g.Email AS GuardianEmail
FROM Child c
INNER JOIN Guardian g ON c.GuardianID = g.GuardianID;

--2. Joining Child and Invoice tables to retrieve the billing status of children:

SELECT c.Name AS ChildName, i.BillingPeriod, i.Amount, i.PaymentStatus
FROM Child c
INNER JOIN Invoice i ON c.ChildID = i.ChildID;

--3. Joining Child and Attendance tables to get the attendance details of children:

SELECT c.Name AS ChildName, a.CheckIn, a.CheckOut
FROM Child c
INNER JOIN Attendance a ON c.ChildID = a.ChildID;

--4. Joining Guardian and Communication tables to get the messages sent by guardians and the corresponding feedback:

SELECT g.Name AS GuardianName, com.Message, com.Feedback
FROM Guardian g
INNER JOIN Communication com ON g.GuardianID = com.GuardianID;

--5. Joining Child, Guardian, and EmergencyContact tables to get the emergency contact information for each child:

SELECT c.Name AS ChildName, g.Name AS GuardianName, ec.Name AS EmergencyContactName, ec.RelationshipToChild, ec.Email AS EmergencyContactEmail, ec.PhoneNo AS EmergencyContactPhone
FROM Child c
INNER JOIN Guardian g ON c.GuardianID = g.GuardianID
INNER JOIN EmergencyContact ec ON c.ChildID = ec.ChildID;

--6. Joining Child, Invoice, and Guardian tables to get the billing status along with the guardian's information:

SELECT c.Name AS ChildName, i.BillingPeriod, i.Amount, i.PaymentStatus, g.Name AS GuardianName, g.Email AS GuardianEmail, g.PhoneNo AS GuardianPhone
FROM Child c
INNER JOIN Invoice i ON c.ChildID = i.ChildID
INNER JOIN Guardian g ON c.GuardianID = g.GuardianID;


--7. Joining Child, Communication, and Staff tables to retrieve communication logs along with the staff member responsible for each communication:

SELECT c.Name AS ChildName, com.CommunicationChannel, com.Message, com.Timestamp, com.Feedback, s.Name AS StaffName
FROM Child c
INNER JOIN Communication com ON c.GuardianID = com.GuardianID
INNER JOIN Staff s ON com.StaffID = s.StaffID;

--8.oining Child, Communication, Staff, and Guardian tables to retrieve communication logs along with the staff member and guardian associated with each communication:

SELECT c.Name AS ChildName, com.CommunicationChannel, com.Message, com.Timestamp, com.Feedback, s.Name AS StaffName, g.Name AS GuardianName
FROM Child c
INNER JOIN Communication com ON c.GuardianID = com.GuardianID
INNER JOIN Staff s ON com.StaffID = s.StaffID
INNER JOIN Guardian g ON c.GuardianID = g.GuardianID;


--9. Joining Child, Invoice, Guardian, and EmergencyContact tables to retrieve billing information along with the guardian and emergency contact details for each child:

SELECT c.Name AS ChildName, i.BillingPeriod, i.Amount, i.PaymentStatus, g.Name AS GuardianName, e.Name AS EmergencyContactName, e.RelationshipToChild, e.Email AS EmergencyContactEmail, e.PhoneNo AS EmergencyContactPhoneNo
FROM Child c
INNER JOIN Invoice i ON c.ChildID = i.ChildID
INNER JOIN Guardian g ON c.GuardianID = g.GuardianID
INNER JOIN EmergencyContact e ON c.ChildID = e.ChildID;


--10. find the names of children whose emergency contacts have communicated via email.

SELECT Name
FROM Child
WHERE ChildID IN (
    SELECT ChildID
    FROM EmergencyContact
    WHERE Email IN (
        SELECT Email
        FROM Communication
        WHERE CommunicationChannel = 'Email'
    )
);



--11. identify children whose emergency contacts prefer to communicate via phone

SELECT Name
FROM Child
WHERE ChildID IN (
    SELECT ChildID
    FROM EmergencyContact
    WHERE EmergencyContactID IN (
        SELECT GuardianID
        FROM Communication
        WHERE CommunicationChannel = 'Phone'
    )
);


--12. find the names of children who have allergies listed in their records.
SELECT Name
FROM Child
WHERE ChildID IN (
    SELECT ChildID
    FROM Child
    WHERE Allergies IS NOT NULL
);



--13. Subquery to Find Staff Members with Highest Number of Communications:

SELECT Name
FROM Staff
WHERE StaffID IN (
    SELECT StaffID
    FROM (
        SELECT StaffID, COUNT(*) AS CommunicationCount
        FROM Communication
        GROUP BY StaffID
    ) AS Subquery
    WHERE CommunicationCount = (
        SELECT MAX(CommunicationCount)
        FROM (
            SELECT COUNT(*) AS CommunicationCount
            FROM Communication
            GROUP BY StaffID
        ) AS MaxSubquery
    )
);

--14. show the total amount paid by each guardian for their children's invoices, and filters out those guardians who have paid more than $200 in total

SELECT g.Name AS GuardianName, SUM(i.Amount) AS TotalPaidAmount
FROM Guardian g
JOIN Child c ON g.GuardianID = c.GuardianID
JOIN Invoice i ON c.ChildID = i.ChildID
WHERE i.PaymentStatus = 'Paid'
GROUP BY g.Name
HAVING SUM(i.Amount) > 200;


--15. Query to Calculate Average Invoice Amount per Child:

SELECT c.Name, AVG(i.Amount) AS AverageAmount
FROM Child c
JOIN Invoice i ON c.ChildID = i.ChildID
GROUP BY c.Name
HAVING AVG(i.Amount) IS NOT NULL;

--16. Query to show those staff members who have sent at least one communication

SELECT s.Name AS StaffName, COUNT(cm.CommunicationID) AS TotalCommunications
FROM Staff s
LEFT JOIN Communication cm ON s.StaffID = cm.StaffID
GROUP BY s.Name
HAVING COUNT(cm.CommunicationID) >= 1;

--17. Query to show the names of guardians along with the average age of their children, but only for those guardians whose children's average age is greater than 5 years.


SELECT g.Name AS GuardianName, AVG(DATEDIFF(YEAR, c.DateOfBirth, GETDATE())) AS AvgChildAge
FROM Guardian g
JOIN Child c ON g.GuardianID = c.GuardianID
GROUP BY g.Name
HAVING AVG(DATEDIFF(YEAR, c.DateOfBirth, GETDATE())) > 5;







