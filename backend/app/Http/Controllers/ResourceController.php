<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/**
 * Generic CRUD for the admin panel's simpler modules. Subclasses set the
 * model, eager loads, searchable columns and filters, and supply rules().
 *
 * index() supports ?search=, any column listed in $filterable (exact
 * match), and ?all=1 to skip pagination (used for dropdowns).
 */
abstract class ResourceController extends Controller
{
    /** @var class-string<Model> */
    protected string $model;

    protected array $with = [];

    protected array $searchable = [];

    protected array $filterable = [];

    protected string $orderBy = 'id';

    protected string $orderDirection = 'desc';

    protected int $perPage = 25;

    protected string $label = 'Record';

    abstract protected function rules(Request $request, ?Model $record): array;

    protected function query(): Builder
    {
        return $this->model::query()->with($this->with);
    }

    /**
     * Hook for extra, module-specific filters.
     */
    protected function applyFilters(Builder $query, Request $request): void
    {
    }

    /**
     * Hook to adjust validated data before it is saved.
     */
    protected function prepare(array $data, ?Model $record, Request $request): array
    {
        return $data;
    }

    public function index(Request $request)
    {
        $query = $this->query();

        $search = trim((string) $request->query('search', ''));
        if ($search !== '' && $this->searchable) {
            $query->where(function ($q) use ($search) {
                foreach ($this->searchable as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        foreach ($this->filterable as $column) {
            $value = $request->query($column);
            if ($value !== null && $value !== '') {
                $query->where($query->getModel()->qualifyColumn($column), $value);
            }
        }

        $this->applyFilters($query, $request);

        $query->orderBy($query->getModel()->qualifyColumn($this->orderBy), $this->orderDirection)
            ->orderBy($query->getModel()->qualifyColumn('id'), 'desc');

        if ($request->boolean('all')) {
            return response()->json(['data' => $query->get()]);
        }

        return $query->paginate($this->perPage)->withQueryString();
    }

    public function store(Request $request)
    {
        $data = $this->prepare($request->validate($this->rules($request, null)), null, $request);
        $record = $this->model::create($data);

        return response()->json([
            'message' => "{$this->label} created successfully.",
            'data' => $this->find($record->getKey()),
        ], 201);
    }

    public function show($id)
    {
        return $this->find($id);
    }

    public function update(Request $request, $id)
    {
        $record = $this->model::findOrFail($id);
        $data = $this->prepare($request->validate($this->rules($request, $record)), $record, $request);
        $record->update($data);

        return response()->json([
            'message' => "{$this->label} updated successfully.",
            'data' => $this->find($record->getKey()),
        ]);
    }

    public function destroy($id)
    {
        $this->model::findOrFail($id)->delete();

        return response()->json(['message' => "{$this->label} deleted successfully."]);
    }

    protected function find($id): Model
    {
        return $this->query()->findOrFail($id);
    }
}
