<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends ResourceController
{
    protected string $model = User::class;

    protected array $searchable = ['name', 'email'];

    protected array $filterable = ['role'];

    protected string $orderBy = 'name';

    protected string $orderDirection = 'asc';

    protected string $label = 'User';

    protected function rules(Request $request, ?Model $record): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($record?->id)],
            'role' => ['required', Rule::in(User::ROLES)],
            // Required for new users; leave blank on edit to keep the current one.
            'password' => [$record ? 'nullable' : 'required', 'string', 'min:8'],
        ];
    }

    protected function prepare(array $data, ?Model $record, Request $request): array
    {
        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if ($record && $record->role === 'admin' && $data['role'] !== 'admin') {
            $this->ensureAnotherAdmin($record);
        }

        return $data;
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === request()->user()->id) {
            throw ValidationException::withMessages(['user' => ['You cannot delete your own account.']]);
        }
        if ($user->role === 'admin') {
            $this->ensureAnotherAdmin($user);
        }

        $user->tokens()->delete();

        return parent::destroy($id);
    }

    private function ensureAnotherAdmin(User $user): void
    {
        if (! User::where('role', 'admin')->where('id', '!=', $user->id)->exists()) {
            throw ValidationException::withMessages(['role' => ['There must always be at least one admin.']]);
        }
    }
}
