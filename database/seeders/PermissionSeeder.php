<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * List of permissions
     *
     * @var array
     */
    protected array $permissions = [
        'access_control_panel',
        'manage_wallets',
        'manage_payments',
        'manage_banks',
        'manage_giftcards',
        'manage_exchange',
        'manage_users',
        'manage_localization',
        'manage_customization',
        'manage_settings',
        'manage_peer_trades',
        'manage_modules',
    ];

    /**
     * List of depreciated permissions
     *
     * @var array
     */
    protected array $depreciated = [
        'view_users',
        'update_users',
        'verify_users',
    ];

    /**
     * List of roles and their levels
     *
     * @var array
     */
    protected array $roles = [
        'Super Admin' => [
            'rank'        => 1,
            'permissions' => [],
        ],
        'Operator'    => [
            'rank'        => 2,
            'permissions' => [
                'access_control_panel',
            ],
        ],
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->seedPermissions();
        $this->seedRoles();
    }

    /**
     * Seed Permissions Table
     *
     * @return void
     */
    protected function seedPermissions()
    {
        collect($this->depreciated)->each(function ($name){
            Permission::whereName($name)->delete();
        });

        collect($this->permissions)->each(function ($name) {
            Permission::firstOrCreate(compact('name'));
        });
    }

    /**
     * Seed roles table
     *
     * @return void
     */
    protected function seedRoles()
    {
        collect($this->roles)->each(function ($data, $name) {
            $role = Role::updateOrCreate(compact('name'), [
                'rank' => $data['rank'],
            ]);

            $role->syncPermissions($data['permissions']);
        });
    }
}
