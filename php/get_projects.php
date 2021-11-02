<?php

header('Content-Type: application/json');

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.basespace.illumina.com/v1pre3/users/current/projects?SortBy=Id&SortDir=Asc',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    "Authorization: " . $_POST['token']
  ),
));

$response = curl_exec($curl);
curl_close($curl);

$response = json_encode(array("output"=>$response), true);

echo $response;

?>