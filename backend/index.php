<?php

$request = $_SERVER['REQUEST_URI'];
$apiPath = '/api';

switch ($request) {
    case '/':
        require __DIR__ . '/home/home.php';
    break;

    // Get Route
    case '/git/' || '/git':
        require __DIR__ . $apiPath . '/git.php';
    break;

    // Add Route
    case '/add/' || '/add':
        require __DIR__ . $apiPath . '/add.php';
    break;

    // Delete Route
    case '/delete/' ||'/delete':
        require __DIR__ . $apiPath . '/delete.php';
    break;

    // Update Route
    case '/update/' || '/update':
        require __DIR__ . $apiPath . '/update.php';
    break;

    // Delete Route
    case '/login/' ||'/login':
        require __DIR__ . $apiPath . '/login.php';
    break;

    default:
    require __DIR__ . '/home/home.php';
    break;
}