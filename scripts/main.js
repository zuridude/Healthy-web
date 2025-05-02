var postSelector = '';
var TextSelector = '';

const highlightColor = 'rgba(255, 0, 0, 0.2)'; // Less aggressive highlight
const blurFilter = 'blur(11px)';
const grayscale = 'grayscale(100%)'

switch (window.location.href) {
    case 'https://x.com/':
    case 'https://x.com/home':
        postSelector = 'div[data-testid="cellInnerDiv"]';
        TextSelector = 'div[data-testid="tweetText"]';
        break;
    case 'https://www.facebook.com/':
        postSelector = 'div.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z';//might change in the future :c
        TextSelector = 'div[data-ad-rendering-role="story_message"]';
    default:

        break;
}

var bannedWords = [];

// TODO: Agregar un boton an los post para eliminar el blur, 
// tambien sacar un ID de la fecha de los tweets, para no repetir informacion y que no se haga un loop infinito 
function createShowButton() {
    const showButton = document.createElement('button');
    showButton.textContent = 'Mostrar Tweet';
    return showButton;
}

function getLocalStorageBannedWords() {
    chrome.storage.local.get(['bannedWords'], (result) => {
        if (result.bannedWords && Array.isArray(result.bannedWords)) {
            bannedWords = result.bannedWords;
        }
    });
}

function containsBannedWord(text, bannedWords) {
    if (!text) return false;

    // Create a regex pattern that matches whole words only
    const wordBoundary = '\\b';
    const pattern = new RegExp(
        bannedWords.map(word =>
            `${wordBoundary}${escapeRegExp(word)}${wordBoundary}`
        ).join('|'),
        'i' // case insensitive
    );

    return pattern.test(text);
}

// Helper function to escape special regex characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function processPosts() {
    getLocalStorageBannedWords()
    const elements = document.querySelectorAll(postSelector);
    elements.forEach(element => {

        const postsText = element.querySelector(TextSelector);
        if (!postsText || bannedWords.length === 0) return;

        const hasBannedWord = containsBannedWord(postsText.textContent, bannedWords);
        if (hasBannedWord) {
            element.querySelector('video') != null ? element.querySelector('video').pause() : '';
            element.style.background = highlightColor;
            element.style.pointerEvents = 'none'
            element.style.filter = blurFilter;
            element.style.userSelect = "none";

        }

    });
}

// for infinite scroll
const observer = new MutationObserver(processPosts);
observer.observe(document.body, {
    childList: true,
    subtree: true
});

processPosts();