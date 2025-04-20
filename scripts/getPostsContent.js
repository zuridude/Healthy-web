const postSelector = 'div[data-testid="cellInnerDiv"]';
const tweetTextSelector = 'div[data-testid="tweetText"]';
const highlightColor = 'rgba(255, 0, 0, 0.2)'; // Less aggressive highlight

var bannedWords = [];

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
        element.style.background = hasBannedWord ? highlightColor : '';
    });
}

// for infinite scroll
const observer = new MutationObserver(processTweets);
observer.observe(document.body, { 
    childList: true, 
    subtree: true 
});

processTweets();