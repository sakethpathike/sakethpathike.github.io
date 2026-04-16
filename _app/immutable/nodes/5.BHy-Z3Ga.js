import{$ as e,B as t,D as n,I as r,J as i,R as a,S as o,V as s,Y as c,a as l,b as u}from"../chunks/C5o3b5G5.js";import"../chunks/CFKVnMbq.js";import{t as d}from"../chunks/C7PTVOs-.js";import"../chunks/-ToDqmqz.js";import{t as f}from"../chunks/DgtPQTdQ.js";var p=`:root {
    /* fonts and typography batch only, no colors */
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
        --background: #060A06;
        --codeblock-bg: #0D130D;
        --color-heading: #BAE6B3;
        --color-accent: #78C273;
        --color-text: #D2E8D0;
        --color-text-secondary: #94B092;
        --color-text-muted: #466345;
        --color-border: #162116;
        --color-surface: #0D130D;
        --color-heading-on: #060A06;
    }
}

@media (prefers-color-scheme: light) {
    body:not(.theme-dark) {
        --background: #F4F9F3;
        --codeblock-bg: #E6F0E5;
        --color-heading: #1C4018;
        --color-accent: #3A7334;
        --color-text: #132111;
        --color-text-secondary: #4A6648;
        --color-text-muted: #88A386;
        --color-border: #C1D6BF;
        --color-surface: #FFFFFF;
        --color-heading-on: #FFFFFF;
    }
}

body.theme-dark {
    --background: #060A06;
    --codeblock-bg: #0D130D;
    --color-heading: #BAE6B3;
    --color-accent: #78C273;
    --color-text: #D2E8D0;
    --color-text-secondary: #94B092;
    --color-text-muted: #466345;
    --color-border: #162116;
    --color-surface: #0D130D;
    --color-heading-on: #060A06;
}

body.theme-light {
    --background: #F4F9F3;
    --codeblock-bg: #E6F0E5;
    --color-heading: #1C4018;
    --color-accent: #3A7334;
    --color-text: #132111;
    --color-text-secondary: #4A6648;
    --color-text-muted: #88A386;
    --color-border: #C1D6BF;
    --color-surface: #FFFFFF;
    --color-heading-on: #FFFFFF;
}

html, body {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
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
}`,m=o(`<div class="misc-container svelte-1ago2e9"><p class="svelte-1ago2e9">This site was originally built using <a href="https://github.com/sakethpathike/kapsule" target="_blank" rel="noopener noreferrer">kapsule</a>.
            and a few other pieces, which turned into a custom SSG called <a href="https://github.com/sakethpathike/kamp" target="_blank" rel="noopener noreferrer">kamp</a>.
            It served well for a while, but making
            the static snapshot logic keep up with every single change just wasn't practical long-term. It got archived
            and open-sourced under AGPLv3.</p> <p class="svelte-1ago2e9">Now the site runs on SvelteKit. Most of the HTML is literally copy-pasted
            from previous Kamp iterations. A new color scheme, fonts, and a few design changes for components are the
            main differences; other than that, it's mostly the same thing.</p> <h3 class="svelte-1ago2e9">Site License</h3> <p class="svelte-1ago2e9">Unless otherwise stated, all written content on the blog is licensed under <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC
                4.0</a>.
            You can share and adapt the material, provided you give appropriate credit.</p> <h3 class="svelte-1ago2e9">Art & Assets</h3> <p class="svelte-1ago2e9">Secretary bird artwork, which is used for the favicon and Open Graph images, is by <a href="https://maximebudar.artstation.com/" target="_blank" rel="noopener noreferrer">Maxime Budar</a> (used under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>). Check out his <a href="https://www.artstation.com/maximebudar" target="_blank" rel="noopener noreferrer">ArtStation</a> for more amazing artworks.</p> <details class="svelte-1ago2e9"><summary class="svelte-1ago2e9"><h3 class="svelte-1ago2e9">Typography</h3></summary> <ul class="typography-list svelte-1ago2e9"><li class="svelte-1ago2e9">Headings & Code: <a href="https://fonts.google.com/specimen/JetBrains+Mono" target="_blank" rel="noopener noreferrer">JetBrains Mono</a></li> <li class="svelte-1ago2e9">Body: <a href="https://fonts.google.com/specimen/Schibsted+Grotesk" target="_blank" rel="noopener noreferrer">Schibsted Grotesk</a></li></ul></details> <details class="svelte-1ago2e9"><summary class="svelte-1ago2e9"><h3 class="svelte-1ago2e9">Color Scheme</h3></summary> <div class="theme-blocks svelte-1ago2e9"><!> <!></div></details></div>`);function h(o,h){c(h,!1);let g=t(``),_=t(``),v=p.match(/body\.theme-dark\s*{([^}]+)}/);v&&s(g,v[1].trim().split(`
`).map(e=>e.trim()).join(`
`));let y=p.match(/body\.theme-light\s*{([^}]+)}/);y&&s(_,y[1].trim().split(`
`).map(e=>e.trim()).join(`
`)),l(),d(o,{currentBaseRoute:`misc`,children:(t,i)=>{var o=m(),s=a(r(o),14),c=a(r(s),2),l=r(c);f(l,{filename:`dark`,get text(){return n(g)}}),f(a(l,2),{filename:`light`,get text(){return n(_)}}),e(c),e(s),e(o),u(t,o)},$$slots:{default:!0}}),i()}export{h as component};