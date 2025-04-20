// const contentSlector = 'div[data-testid="tweetText"]';

//div[data-testid="tweetText"] <--- <span> contiene el texto del post
//div[data-testid="cellInnerDiv"] <--- post de twitter completo

const postSlector = 'div[data-testid="cellInnerDiv"]'; 

bannedWord = 'the'

addEventListener("scroll", (event) => {
        let elements = document.querySelectorAll(postSlector);
        elements.forEach(element => {
            let text = element.querySelector('div[data-testid="tweetText"]')
            if(!!text){
                if(findWord(bannedWord,text.innerHTML)){
                    // console.log("texto: " + text.innerHTML)
                    element.style.background  = "red";
                }
            }
                    
        });
    });


function findWord(word, str) {
    return str.split(' ').some(function(w){return w === word})
}