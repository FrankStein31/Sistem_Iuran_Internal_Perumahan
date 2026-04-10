<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Windows PHP Dev Server fallback for storage files
Route::get('/storage/{path}', function ($path) {
    $filepath = storage_path('app/public/' . $path);
    if (file_exists($filepath)) {
        return response()->file($filepath);
    }
    abort(404);
})->where('path', '.*');
