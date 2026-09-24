<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use Auditable;

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'body',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'date:Y-m-d',
    ];
}
