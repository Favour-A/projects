<?php

    // example use from browser
    // http://localhost/companydirectory/libs/php/getAll.php

    // remove next two lines for production
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;
    }   

    $where = $_REQUEST['where'];
    $id = $_REQUEST['id'];
    $query = '';

    if ($where == 'department') {
        $query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE d.id = ? ORDER BY p.lastName, p.firstName, d.name, l.name';
    } else if ($where == 'location') {
        $query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE l.id = ? ORDER BY p.lastName, p.firstName, d.name, l.name';
    } else {
        $query = 'SELECT * FROM department WHERE id = ?';
    }

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);

    $stmt->execute();

    $result = $stmt->get_result();

    if (!$result) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";    
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output); 
        exit;
    }

    $data = [];

    while ($row = $result->fetch_assoc()) {
        array_push($data, $row);
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $data;
    
    mysqli_close($conn);

    echo json_encode($output); 
?>
