<template>
    <div>
        <app-header subtitle="About MooMask" />

        <main class="main">
            <div class="about">
                <div class="about-content">
                    <p>MooMask is a browser extension wallet for Binance Smart Chain. MooMask enables you to access BSC Blockchain directly from your favorite browser.</p>

                    <p>We never hold / have access to your private key. The private key is encrypted and only stored on your browser. For safety, always logout your wallet after using it.</p>

                    <h2 class="partners-title">Partner</h2>

                    <div class="partners">
                        <external-link url="https://moopay.live/">
                            <img src="images/moopay.png" alt="MooPay">
                        </external-link>
                    </div>
                </div>

                <div class="about-footer">
                    <div class="about-socials">
                    </div>
                    <div class="about-version">v0.0.1</div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import AppHeader from '../components/AppHeader.vue'
    import ExternalLink from '../components/ExternalLink.vue'

    export default {
        components: {
            AppHeader,
            ExternalLink
        }
    }
</script>

<style>
    .about {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 480px;
        font-size: 0.875rem;
    }
    .about-content p {
        color: #616161;
    }
    .about-version {
        font-size: 0.75rem;
        text-align: center;
        color: #9E9E9E;
    }

    .about-socials {
        padding: 1.5rem 0 0;
        font-size: 1rem;
        text-align: center;
        margin-bottom: 0.75rem;
    }
    .about-socials a {
        display: inline-block;
        color: #BDBDBD;
        margin: 0 0.5rem;
    }
    .about-socials a.medium:hover,
    .about-socials a.github:hover {
        color: #333;
    }
    .about-socials a.twitter:hover {
        color: #1da1f2;
    }

    .partners-title {
        font-size: 0.75rem;
        text-align: center;
        text-transform: uppercase;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
    }
    .partners {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    .partners a {
        display: block;
        width:60%;
    }
    .partners img {
        max-width: 100%;
    }
</style>

