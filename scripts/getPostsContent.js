const postSelector = 'div[data-testid="cellInnerDiv"]';
const tweetTextSelector = 'div[data-testid="tweetText"]';
const highlightColor = 'rgba(255, 0, 0, 0.2)'; // Less aggressive highlight
const blurFilter = 'blur(11px)';

var bannedWords = [];

// TODO: Agregar un boton an los post para eliminar el blur, 
// tambien sacar un ID de la fecha de los tweets, para no repetir informacion y que no se haga un loop infinito 
function createShowButton(){
    const showButton = document.createElement('button');
    showButton.textContent = 'Mostrar Tweet';
    return showButton;    
}

function getLocalStorageBannedWords(){
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


function processTweets() {
    getLocalStorageBannedWords()
    const elements = document.querySelectorAll(postSelector);
    
    elements.forEach(element => {
        const tweetText = element.querySelector(tweetTextSelector);
            if (!tweetText || bannedWords.length === 0) return;
        
        const hasBannedWord = containsBannedWord(tweetText.textContent, bannedWords);
        if(hasBannedWord){
            element.style.background = highlightColor;
            element.style.filter = blurFilter;
            element.style.pointerEvents = 'none'
        }

    });
}

// for infinite scroll
const observer = new MutationObserver(processTweets);
observer.observe(document.body, { 
    childList: true, 
    subtree: true 
});

processTweets();