
<?php
// Your API endpoint URL
$apiEndpoint = "https://calendarific.com/api/v2/holidays?&api_key=&country=" . $_REQUEST['country'] . "&year=2023";

// Set up cURL
$curl = curl_init($apiEndpoint);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

// Call the API
$response = curl_exec($curl);

// Close cURL to free up resources
curl_close($curl);

// Send the response back as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>





