const inquirer = require("inquirer");
const mysql = require("mysql");

//MySQL logins
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_trackerdb"
});


//SQL Connection 
connection.connect(function (err) {
    if (err) {
        console.error("Error connecting: " + err.stack);
        return;
    }

    console.log("Connected as id " + connection.threadId);

    if (connection.connect) {
        getUserInput();
    };
});


//variables To select tables from SQL 
let departments = "SELECT * FROM department;";
let roles = "SELECT * FROM role;";
let employees = "SELECT * FROM employee;";
let allData = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id;";


function viewTable(query) {
    connection.query(query, function (err, res) {
        console.table(res)
    });
    setTimeout(function () { getUserInput() }, 500);
};

function getUserInput() {
    try {
        let data = inquirer.prompt([
            {
                type: "list",
                message: "Please select below:",
                choices: ["[Add Data]", "[View Data]", "[Update Employee Roles]", "[Quit]"],
                name: "processChoice"
            }
        ]).then(function (data) {
            switch (data.processChoice) {
                case "[Add Data]":
                    displayAddMenu();
                    break;
                case "[View Data]":
                    displayViewMenu();
                    break;
                case "[Update Employee Roles]":
                    updateRoles();
                    break;
                case "[Quit]":
                    connection.end();
                    break;
            }
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};

function displayAddMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "Select what you would like to add:",
            choices: ["[Add Departments]", "[Add Roles]", "[Add Employees]", "[Main Menu]", "[Quit]"],
            name: "addChoice"
        }
    ]).then(function (answer) {
        

        //Reconstruct this:
        switch (answer.addChoice) {
            case "[Add Departments]":
                addDepartment();
                break;
            case "[Add Roles]":
                addRole();
                break;
            case "[Add Employees]":
                addEmployee();
                break;
            case "[Main Menu]":
                getUserInput();
                break;
            case "[Quit]":
                connection.end();
                break;
        }
    });
};

function displayViewMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "Please select below:",
            choices: ["[View Departments]", "[View Roles]", "[View Employees]", "[View All]", "[Main Menu]", "[Quit]"],
            name: "viewChoice"
        }
    ]).then(function (answer) {
        //Switch statements to get what the user wants to do
        switch (answer.viewChoice) {
            case "[View Departments]":
                viewTable(departments);
                break;
            case "[View Roles]":
                viewTable(roles);
                break;
            case "[View Employees]":
                viewTable(employees);
                break;
            case "[View All]":
                viewTable(allData);
                break;
            case "[Main Menu]":
                getUserInput();
                break;
            case "[Quit]":
                connection.end();
                break;
        }
    });
};

function updateRoles() {
    //Function for updating roles
    connection.query("SELECT * FROM employee;", function (err, results) {
        inquirer.prompt([
            {
                name: "chosenEmployee",
                message: "Which employee's role would you like to update?",
                type: "list",
                choices: function () {
                    let choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArray.push(`${results[i].first_name} ${results[i].last_name}`)
                    } return choiceArray;
                }
            },
            {
                name: "chosenRole",
                message: "Enter the new role ID for the selected employee:",
                type: "input"
            }
        ]).then(function (answer) {
            var chosenEmployee;

            for (var i = 0; i < results.length; i++) {
                if (`${results[i].first_name} ${results[i].last_name}` === answer.chosenEmployee) {
                    chosenEmployee = results[i];
                }
            };

            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                        role_id: answer.chosenRole
                    },
                    {
                        id: chosenEmployee.id
                    }
                ],
                function (error) {
                    if (error) throw error;
                    console.log(`Successfully updated ${answer.chosenEmployee}`)

                    viewTable(employees);
                    
                }
            );
        })
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name for this department?"
        }
    ]).then(function (answer) {
        let name = answer.name;
        name = name.charAt(0).toUpperCase() + name.slice(1);

        connection.query(`INSERT INTO department (name) values ("${name}")`,
            function (err) {
                if (err) throw err;
                
                console.log(`Added department: ${name}`);

                viewTable(departments);
                
            });
    });
};

function addRole() {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the title for this role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?"
        },
        {
            name: "department",
            type: "input",
            message: "Enter the department ID:"
        }
    ]).then(function (answer) {
        let title = answer.title;
        title = title.charAt(0).toUpperCase() + title.slice(1);

        let salary = answer.salary;
        let department = answer.department;

        connection.query(`INSERT INTO role (title, salary, department_id) values ("${title}", "${salary}", "${department}")`,
            function (err) {
                if (err) throw err;
                console.log(`Added role: ${title} with salary: ${salary} at department: ${department}`);

                viewTable(roles);
                
            })
    });
};

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter first name?",
            name: "first_name"
        },
        {
            type: "input",
            message: "Please enter last name?",
            name: "last_name"
        },
        {
            name: "role",
            type: "input",
            message: "Please enter Role ID for the employee?"
        }
    ]).then(function (answer) {
        let first_name = answer.first_name;
        first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);

        let last_name = answer.last_name;
        last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);

        let role = answer.role;

        connection.query(`INSERT INTO employee (first_name, last_name, role_id) values ("${first_name}", "${last_name}", "${role}")`);
        console.log(`You successfully added: ${first_name} ${last_name} with role ID: ${role}`);

        viewTable(employees);
         
    });

};