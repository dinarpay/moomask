/**
 * @see {@link https://developer.chrome.com/extensions/manifest}
 */
module.exports = {
    name: 'MooMask',
    description: 'Binance Smart Chain Browser Extension Wallet',
    author: 'MooMask',
    version: '0.0.1',
    icons: {
        '16': 'icons/16.png',
        '32': 'icons/32.png',
        '48': 'icons/48.png',
        '128': 'icons/128.png'
    },
    /**
     * @see {@link https://developer.chrome.com/extensions/declare_permissions}
     */
    permissions: [
        'storage',
        'tabs'
    ],
    browser_action: {
        default_title: 'MooMask',
        default_popup: 'popup.html'
    },
    manifest_version: 2,
    content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'"
}
