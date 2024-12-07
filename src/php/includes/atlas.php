<?php

$client = new MongoDB\Client;

$uri = 'mongodb+srv://kurtrockx:databasePassword@pormahub.t3dph.mongodb.net/?retryWrites=true&w=majority&appName=pormaHUB';
$client = new MongoDB\Client($uri);
