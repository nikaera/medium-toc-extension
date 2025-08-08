require("babel-polyfill");
import { createPopper } from '@popperjs/core';

const oldCopyButton = document.querySelector("#copyButton")
if(oldCopyButton) oldCopyButton.remove();

try {
    const tooltip = document.createElement('div')
    tooltip.id = 'tooltip'
    tooltip.role = 'tooltip'
    tooltip.innerText = 'Copy of \nthe TOC';
    tooltip.style.display = 'none'

    document.body.appendChild(tooltip)

    const copyButton = document.createElement('button');
    copyButton.id = 'copyButton'
    copyButton.className = 'copyButton';
    copyButton.setAttribute('aria-describedby', 'tooltip')

    copyButton.onclick = () => {
        copyToClip(generateTagText());
        tooltip.innerText = 'Copied!';
    }

    copyButton.onmouseenter = () => {
        tooltip.style.display = 'block';
    }

    copyButton.onmouseleave = () => {
        tooltip.style.display = 'none';
        tooltip.innerText = 'Copy of \nthe TOC';
    }

    const copyButtonImage = document.createElement('img');
    copyButtonImage.src = chrome.runtime.getURL('images/buttonIcon.png');
    copyButton.appendChild(copyButtonImage);

    const navBarButton = document.createElement('div');
    navBarButton.className = 'u-flexCenter u-height65 u-xs-height56';
    navBarButton.appendChild(copyButton)
    document.querySelectorAll(".metabar-block,.u-flex0,.u-flexCenter")[0].appendChild(navBarButton);

    createPopper(copyButton, tooltip, {
        placement: 'bottom-start'
    });
} catch (error) {
    console.error(error);
}

const copyToClip = (str) => {
    function listener(e) {
        e.clipboardData.setData("text/html", str);
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
};

const generateTagText = () => {
    const tags = document.body.querySelectorAll('h1,h2,h3,h4,h5,h6');

    const filteredTags = []
    for(var i = 0; i < tags.length; i++) {
        const tag = tags.item(i);
        const tagName = tag.getAttribute('name')
        const isTitleTag = tag.className.indexOf('graf--title') > 0
        if(!isTitleTag && tagName.length > 0)
            filteredTags.push(tag);
    }

    const hTags = filteredTags.map(tag => {
        const tagId = tag.getAttribute('name');
        switch(tag.tagName) {
            case 'H3':
                return `−&nbsp;<a href='#${tagId}'>${tag.textContent}</a>`
            case 'H4':
                return `−−&nbsp;<a href='#${tagId}'>${tag.textContent}</a>`
            default:
                return ''
        }
    })

    return `${hTags.join('<br/>')}`
}

document.addEventListener('keydown', (e) => {
    const container = document.querySelector(".is-selected");
    if(container && e.ctrlKey && e.key === 't') {
        container.innerHTML = generateTagText();

        const keyboardEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            keyCode: 13
        });
        container.dispatchEvent(keyboardEvent);
    }
});
