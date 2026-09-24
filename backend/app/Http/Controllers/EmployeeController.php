<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class EmployeeController extends ResourceController
{
    protected string $model = Employee::class;

    protected array $searchable = ['name', 'email', 'designation'];

    protected array $filterable = ['status'];

    protected string $orderBy = 'name';

    protected string $orderDirection = 'asc';

    protected string $label = 'Employee';

    protected function rules(Request $request, ?Model $record): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'designation' => ['nullable', 'string', 'max:255'],
            'monthly_salary' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'hourly_cost' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'currency' => ['required', 'in:INR,USD'],
            'joined_on' => ['nullable', 'date'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }

    protected function prepare(array $data, ?Model $record, Request $request): array
    {
        // Default the hourly cost from salary (about 160 working hours a month).
        if (empty($data['hourly_cost']) && ! empty($data['monthly_salary'])) {
            $data['hourly_cost'] = round($data['monthly_salary'] / 160, 2);
        }

        return $data;
    }
}
