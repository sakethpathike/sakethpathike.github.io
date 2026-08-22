import{$ as e,C as t,G as n,K as r,T as i,U as a,V as o,a as s,et as c,it as l,j as u}from"../chunks/BWc9umX3.js";import"../chunks/CFKVnMbq.js";import{t as d}from"../chunks/CEIAhSia.js";import"../chunks/6OkQQOUT.js";import{t as f}from"../chunks/826G_Alq.js";var p=`:root {
    --font-text: 'Schibsted Grotesk', sans-serif;
    --font-heading: 'JetBrains Mono', monospace;
    --h-family: var(--font-heading);
    --h-size: 28px;
    --h-weight: 700;
    --h-color: var(--color-heading);
    --h-ls: -1px;
    --p-family: var(--font-text);
    --p-size: 18px;
    --p-color: var(--color-text-secondary);
    --p-lh: 1.6;
    --p-weight: 400;
    --p-ls: -0.01em;
}

@media (prefers-color-scheme: dark) {
    body:not(.theme-light) {
        --background: #0A0A0A;
        --codeblock-bg: #1A1A1A;
        --color-heading: #FFFFFF;
        --color-accent: #FFB38A;
        --color-text: #FFFFFF;
        --color-text-secondary: #D4D4D4;
        --color-text-muted: #A3A3A3;
        --color-border: #333333;
        --color-surface: #1A1A1A;
        --color-heading-on: #0A0A0A;
    }
}

@media (prefers-color-scheme: light) {
    body:not(.theme-dark) {
        --background: #FFFFFF;
        --codeblock-bg: #F0F0F0;
        --color-heading: #0A0A0A;
        --color-accent: #852A00;
        --color-text: #0A0A0A;
        --color-text-secondary: #333333;
        --color-text-muted: #595959;
        --color-border: #CCCCCC;
        --color-surface: #FFFFFF;
        --color-heading-on: #FFFFFF;
    }
}

body.theme-dark {
    --background: #0A0A0A;
    --codeblock-bg: #1A1A1A;
    --color-heading: #FFFFFF;
    --color-accent: #FFB38A;
    --color-text: #FFFFFF;
    --color-text-secondary: #D4D4D4;
    --color-text-muted: #A3A3A3;
    --color-border: #333333;
    --color-surface: #1A1A1A;
    --color-heading-on: #0A0A0A;
}

body.theme-light {
    --background: #FFFFFF;
    --codeblock-bg: #F0F0F0;
    --color-heading: #0A0A0A;
    --color-accent: #852A00;
    --color-text: #0A0A0A;
    --color-text-secondary: #333333;
    --color-text-muted: #595959;
    --color-border: #CCCCCC;
    --color-surface: #FFFFFF;
    --color-heading-on: #FFFFFF;
}

html, body {
    width: 100%;
    max-width: 100vw;
    overflow-x: clip;
    margin: 0;
    padding: 0;
}

body {
    background-color: var(--background);
    color: var(--color-text);
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3 {
    font-family: var(--h-family);
    font-size: var(--h-size);
    font-weight: var(--h-weight);
    color: var(--color-heading);
    letter-spacing: var(--h-ls);
    margin: 0;
}

p {
    font-family: var(--p-family);
    font-size: var(--p-size);
    font-weight: var(--p-weight);
    color: var(--p-color);
    line-height: var(--p-lh);
    letter-spacing: var(--p-ls);
    margin: 0;
}

a {
    color: var(--color-accent);
    text-underline-offset: 4px;
}

* {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}`,m=i(`<div class="misc-container svelte-1ago2e9"><p class="svelte-1ago2e9">This site was originally built using <a href="https://github.com/sakethpathike/kapsule" target="_blank" rel="noopener noreferrer">kapsule</a>.
            and a few other pieces, which turned into a custom SSG called <a href="https://github.com/sakethpathike/kamp" target="_blank" rel="noopener noreferrer">kamp</a>.
            It served well for a while, but making
            the static snapshot logic keep up with every single change just wasn't practical long-term. It got archived
            and open-sourced under AGPLv3.</p> <p class="svelte-1ago2e9">Now the site runs on SvelteKit. Most of the HTML is literally copy-pasted
            from previous Kamp iterations. A new color scheme, fonts, and a few design changes for components are the
            main differences; other than that, it's mostly the same thing.</p> <h3 class="svelte-1ago2e9">Site License</h3> <p class="svelte-1ago2e9">Unless otherwise stated, all written content on the blog is licensed under <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC
                4.0</a>.
            You can share and adapt the material, provided you give appropriate credit.</p> <h3 class="svelte-1ago2e9">Art & Assets</h3> <p class="svelte-1ago2e9">Secretary bird artwork, which is used for the favicon and Open Graph images, is by <a href="https://www.linkedin.com/in/maxime-budar-634795252/" target="_blank" rel="noopener noreferrer">Maxime
            Budar</a> (used under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>). Check out <a href="https://www.artstation.com/maximebudar" target="_blank" rel="noopener noreferrer">his
            ArtStation</a> for more amazing artworks.</p> <details class="svelte-1ago2e9"><summary class="svelte-1ago2e9"><h3 class="svelte-1ago2e9">Typography</h3></summary> <ul class="typography-list svelte-1ago2e9"><li class="svelte-1ago2e9">Headings & Code: <a href="https://fonts.google.com/specimen/JetBrains+Mono" target="_blank" rel="noopener noreferrer">JetBrains Mono</a></li> <li class="svelte-1ago2e9">Body: <a href="https://fonts.google.com/specimen/Schibsted+Grotesk" target="_blank" rel="noopener noreferrer">Schibsted Grotesk</a></li></ul></details> <details class="svelte-1ago2e9"><summary class="svelte-1ago2e9"><h3 class="svelte-1ago2e9">Color Scheme</h3></summary> <div class="theme-blocks svelte-1ago2e9"><!> <!></div></details></div>`);function h(i,h){c(h,!1);let g=n(``),_=n(``),v=p.match(/body\.theme-dark\s*{([^}]+)}/);v&&r(g,v[1].trim().split(`
`).map(e=>e.trim()).join(`
`));let y=p.match(/body\.theme-light\s*{([^}]+)}/);y&&r(_,y[1].trim().split(`
`).map(e=>e.trim()).join(`
`)),s(),d(i,{currentBaseRoute:`misc`,meta:{ogImageSrc:`https://sakethpathike.github.io/images/misc.png`},children:(e,n)=>{var r=m(),i=a(o(r),14),s=a(o(i),2),c=o(s);f(c,{filename:`dark`,get text(){return u(g)}}),f(a(c,2),{filename:`light`,get text(){return u(_)}}),l(s),l(i),l(r),t(e,r)},$$slots:{default:!0}}),e()}export{h as component};