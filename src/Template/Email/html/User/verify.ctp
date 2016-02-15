<?php
/**
 * @var Wasabi\Core\View\AppView $this
 * @var \Wasabi\Core\Model\Entity\User $user
 * @var string $instanceName
 * @var array $verifyEmailLink
 */

$this->set('title', __d('wasabi_core', 'Verify Email'));

echo __d(
    'wasabi_core',
    'Hello {username},{nl}before you can start using our backend, you have to verify your email address. To verify your email address click the following link.{nl}{nl}{resetPasswordLink}',
    [
        'username' => '<b>' . $user->username . '</b>',
        'nl' => '<br>',
        'verifyEmailLink' => $this->Email->bigActionButton(__d('wasabi_core', 'Verify Email'), $verifyEmailLink)
    ]
);
