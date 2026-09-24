<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ArticleController extends ResourceController
{
    protected string $model = Article::class;

    protected array $searchable = ['title', 'slug', 'excerpt'];

    protected array $filterable = ['is_published'];

    protected string $orderBy = 'published_at';

    protected string $label = 'Article';

    protected function rules(Request $request, ?Model $record): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('articles', 'slug')->ignore($record?->id)],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['required', 'string', 'max:100000'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    protected function prepare(array $data, ?Model $record, Request $request): array
    {
        if (empty($data['slug'])) {
            $base = Str::slug($data['title']) ?: 'article';
            $slug = $base;
            $n = 2;
            while (Article::where('slug', $slug)->when($record, fn ($q) => $q->where('id', '!=', $record->id))->exists()) {
                $slug = $base.'-'.$n++;
            }
            $data['slug'] = $slug;
        }

        if (! empty($data['is_published']) && empty($data['published_at'])) {
            $data['published_at'] = today()->toDateString();
        }

        return $data;
    }

    /**
     * Public: published articles for the Newsroom page.
     */
    public function publicIndex()
    {
        $articles = Article::where('is_published', true)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get(['id', 'slug', 'title', 'excerpt', 'published_at']);

        return response()->json(['data' => $articles]);
    }

    /**
     * Public: a single published article by slug.
     */
    public function publicShow(string $slug)
    {
        $article = Article::where('is_published', true)->where('slug', $slug)->firstOrFail();

        return response()->json(['data' => $article]);
    }
}
