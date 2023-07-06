<?php

declare(strict_types=1);

namespace App\Response;

use App\Const\ContextGroupConst;
use Symfony\Component\Serializer\Annotation\Groups;

class AuthTokenResponse
{
    #[Groups(ContextGroupConst::API_ALL)]
    private string $token;

    public function getToken(): string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }
}
