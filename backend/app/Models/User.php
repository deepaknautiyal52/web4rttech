<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use Auditable, HasApiTokens, HasFactory, Notifiable;

    const ROLES = ['admin', 'sales', 'finance', 'developer'];

    /**
     * Which roles may use each area of the admin panel. Admins can use
     * everything. Mirrored in src/pages/admin/permissions.js for the UI.
     */
    const AREA_ROLES = [
        'leads' => ['sales'],
        'clients' => ['sales', 'finance'],
        'quotations' => ['sales'],
        'projects' => ['sales', 'developer'],
        'invoices' => ['finance'],
        'finances' => ['finance'],
        'renewals' => ['finance', 'sales'],
        'employees' => ['finance'],
        'timesheets' => ['developer', 'finance'],
        'tickets' => ['sales', 'developer'],
        'content' => ['sales'],
        'users' => [],
        'audit' => [],
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    public function canAccess(string $area): bool
    {
        return $this->role === 'admin' || in_array($this->role, self::AREA_ROLES[$area] ?? [], true);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
