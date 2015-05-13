<?php
/**
 * @var \Wasabi\Core\View\AppView $this
 * @var \Wasabi\Core\Model\Entity\CacheSetting $settings
 * @var array $cacheDurations
 */

$this->Html->setTitle(__d('wasabi_core', 'Cache Settings'));
echo $this->Form->create($settings, ['context' => ['table' => 'Wasabi/Core.CacheSettings'], 'class' => 'no-top-section']);
echo $this->Form->input('enable_caching', [
    'label' => [
        'text' => __d('wasabi_core', 'Enable Caching'),
        'info' => __d('wasabi_core', 'Enable or disable View caching for the entire CMS instance.')
    ],
    'options' => array(
        '0' => __d('core', 'No'),
        '1' => __d('core', 'Yes')
    )
]);
echo $this->Form->input('cache_duration', [
    'label' => [
        'text' => __d('wasabi_core', 'Cache Duration'),
        'info' => __d('wasabi_core', 'This is used as a default setting and can be overriden by individual plugins.')
    ],
    'options' => $cacheDurations
]);
echo $this->Html->div('form-controls');
echo $this->Form->button(__d('wasabi_core', 'Save'), array('div' => false, 'class' => 'button'));
echo $this->Guardian->protectedLink(__d('wasabi_core', 'Cancel'), [
    'plugin' => 'Wasabi/Core',
    'controller' => 'Settings',
    'action' => 'cache'
]);
echo $this->Html->tag('/div');
echo $this->Form->end();
