import http from 'node:http';
import fs from 'node:fs';

// Employee task array
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Amit Kumar",
        status: "In Progress"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Priya Singh",
        status: "Completed"
    }
];

// Create HTTP Server
const server = http.createServer((req, res) => {

    // Route 1: Welcome Page
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end("<h1>Welcome to Employee Task Management System</h1>");
    }

    // Route 2: Display All Tasks
    else if (req.url === "/tasks" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(tasks));
    }

    // Route 3: About Application
    else if (req.url === "/about" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });
        res.end("Employee Task Management Application using Node.js HTTP Module");
    }

    // Route 4: Serve HTML using FS Module
    else if (req.url === "/home" && req.method === "GET") {
        fs.readFile("./public/index.html", (err, data) => {
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                res.end("Error reading HTML file");
            } else {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(data);
            }
        });
    }

    // Invalid Routes
    // Route 5: Add New Task using POST
    else if (req.url === "/add-task" && req.method === "POST") {

        let body = "";

        // Receive data from client
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        // Process data after receiving everything
        req.on("end", () => {

            try {
                const newTask = JSON.parse(body);

                // Validate required fields
                if (
                    newTask.id === undefined ||
                    !newTask.taskName ||
                    !newTask.assignedTo ||
                    !newTask.status
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "All required fields are necessary"
                    }));

                    return;
                }

                // Check for duplicate ID
                if (tasks.some(task => task.id === newTask.id)) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "Task ID already exists"
                    }));

                    return;
                }

                // Add task to array
                tasks.push(newTask);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Task added successfully",
                    task: newTask
                }));

            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));
            }
        });
    }

    // Invalid Routes
    else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
    }

});

// Start Server
server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});