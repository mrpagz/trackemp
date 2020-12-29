drop database if exists employee_db;

create database employee_db;

use employee_db;

create table department (
	id int auto_increment not null,
    name varchar(30) not null,
    primary key (id)
);

create table role (
	id int auto_increment not null,
    title varchar(30),
    salary decimal(10,2),
    department_id int,
    primary key (id),
    foreign key (department_id) references department (id)
);

create table employee (
	id int auto_increment not null,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    primary key (id),
    foreign key (role_id) references role (id)
);

insert into employee (first_name, last_name) values ("Lebron", "James"); 

select * from department;
select * from role;
select * from employee;