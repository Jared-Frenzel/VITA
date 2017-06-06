USE vita;

-- Litmus questions

-- Question 1
INSERT INTO LitmusQuestion (string, orderIndex, tag)
	VALUES ("Will you require a Depreciation Schedule?", 1, "depreciation_schedule");
SET @lastInsertId = LAST_INSERT_ID();

INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("No", 1, @lastInsertId);
INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("Yes", 2, @lastInsertId);
-- End Question 1

-- Question 2
INSERT INTO LitmusQuestion (string, orderIndex, tag)
	VALUES ("Will you require a Schedule F (Farm)?", 2, "schedule_f");
SET @lastInsertId = LAST_INSERT_ID();

INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("No", 1, @lastInsertId);
INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("Yes", 2, @lastInsertId);
-- End Question 2

-- Question 3
INSERT INTO LitmusQuestion (string, orderIndex, tag)
	VALUES ("Are you self-employed or own a home-based business?", 3, "self_employed");
SET @lastInsertId = LAST_INSERT_ID();

INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("No", 1, @lastInsertId);
INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("Yes", 2, @lastInsertId);
-- End Question 3

-- Question 4
INSERT INTO LitmusQuestion (string, orderIndex, tag)
	VALUES ("Will your return have casulty losses?", 4, "casulty_losses");
SET @lastInsertId = LAST_INSERT_ID();

INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("No", 1, @lastInsertId);
INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("Yes", 2, @lastInsertId);
-- End Question 4

-- Question 5
INSERT INTO LitmusQuestion (string, orderIndex, tag)
	VALUES ("Will your return have theft losses?", 5, "theft_losses");
SET @lastInsertId = LAST_INSERT_ID();

INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("No", 1, @lastInsertId);
INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("Yes", 2, @lastInsertId);
-- End Question 5

-- Question 6
INSERT INTO LitmusQuestion (string, orderIndex, tag)
	VALUES ("Will you require a Schedule E (rental income)?", 6, "schedule_e");
SET @lastInsertId = LAST_INSERT_ID();

INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("No", 1, @lastInsertId);
INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("Yes", 2, @lastInsertId);
-- End Question 6

-- Question 7
INSERT INTO LitmusQuestion (string, orderIndex, tag) 
	VALUES ("Will you require a Schedule K-1 (partnership or trust income)?", 7, "schedule_k-1");
SET @lastInsertId = LAST_INSERT_ID();

INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("No", 1, @lastInsertId);
INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("Yes", 2, @lastInsertId);
-- End Question 7

-- Question 8
INSERT INTO LitmusQuestion (string, orderIndex, tag)
	VALUES ("Do you have income from dividends, capital gains, or minimal brokerage transactions?", 8, "dividends_income");
SET @lastInsertId = LAST_INSERT_ID();

INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("No", 1, @lastInsertId);
INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("Yes", 2, @lastInsertId);
-- End Question 8
    
-- Question 9
INSERT INTO LitmusQuestion (string, orderIndex, tag)
	VALUES ("Will your return involve a current bankruptcy?", 9, "current_bankruptcy");

-- End Question 9

-- Question 10
INSERT INTO LitmusQuestion (string, orderIndex, tag)
	VALUES ("Will your return involve income from more than one state?", 10, "multiple_states");
SET @lastInsertId = LAST_INSERT_ID();

INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("No", 1, @lastInsertId);
INSERT INTO PossibleAnswer (string, orderIndex, litmusQuestionId) 
	VALUES ("Yes", 2, @lastInsertId);
-- End Question 10