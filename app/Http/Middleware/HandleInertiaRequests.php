<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Facades\Auth; // Perbaiki import Auth
use Spatie\Permission\Traits\HasRoles; // Tambahkan import ini jika dibutuhkan oleh model user
use App\Models\User;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    // public function share(Request $request): array
    // {
    //     [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

    //     return [
    //         ...parent::share($request),
    //         'name' => config('app.name'),
    //         'quote' => ['message' => trim($message), 'author' => trim($author)],
    //         'auth' => [
    //             'user' => $request->user(),
    //         ],
    //         'ziggy' => fn (): array => [
    //             ...(new Ziggy)->toArray(),
    //             'location' => $request->url(),
    //         ]
    //     ];
    // }

    public function share(Request $request): array
    {
        // $user = Auth::user(); // Gunakan Auth::user() untuk mendapatkan user yang login
        $user = $request->user();

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            // Hapus atau ganti quote jika tidak diperlukan
            'quote' => ['message' => Inspiring::quotes()->random(), 'author' => 'Inspiring'],
        ]);
    }
}
