DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- DEPARTMENT TABLE ----
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
 
);
-- DEPARTMENT TABLE ----
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);
-- EMPLOYEE ROLE TABLE ----
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id)

);

-- DEPARTMENT SEEDS -----
INSERT INTO department (name)
VALUE ("Marketing");
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Finance");

-- EMPLOYEE ROLE SEEDS -------
INSERT INTO role (title, salary, department_id)
VALUE ("Marketing Coordinator", 50000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesman", 60000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 80000, 3);

-- EMPLOYEE SEEDS -------
INSERT INTO employee (first_name, last_name, role_id)
VALUE ("Lebron", "James", 1);
INSERT INTO employee (first_name, last_name, role_id)
VALUE ("Michael", "Jordan", 2);
INSERT INTO employee (first_name, last_name, role_id)
VALUE ("Kobe","Bryant", 3);

-- SELECTING FOR CREATING 
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;