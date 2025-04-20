document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('dataInput');
    const saveBtn = document.getElementById('saveBtn');
    const bannedList = document.getElementById('bannedList');
    const deleteBtn = document.getElementById('deleteBtn');


    let bannedWords = [];

    chrome.storage.local.get(['bannedWords'], (result) => {
        if (result.bannedWords && Array.isArray(result.bannedWords)) {
        bannedWords = result.bannedWords; 
        updateList();
        }
    });

    
    saveBtn.addEventListener('click', () => {
      const addedWord = input.value.trim();
      if (addedWord) {
        bannedWords.push(addedWord);
        input.value='';
        chrome.storage.local.set({ bannedWords });
        updateList();
      }
    });

    deleteBtn.addEventListener('click',() => {
        bannedWords = [];
        chrome.storage.local.set({ bannedWords });
        updateList();
    });

    function updateList(){
        bannedList.innerHTML = bannedWords.map(item => `<li>${item}</li>`).join('');
    }
});