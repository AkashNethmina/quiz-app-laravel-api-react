<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $request->wantsJson()
                ? response()->json(['message' => 'Email already verified.'])
                : redirect()->intended(config('app.frontend_url').'/dashboard');
        }

        $request->user()->sendEmailVerificationNotification();

        return $request->wantsJson()
            ? response()->json(['status' => 'verification-link-sent'])
            : back()->with('status', 'verification-link-sent');
    }
}
