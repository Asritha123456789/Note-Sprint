document.addEventListener('DOMContentLoaded', function() {
    let tabCounter = 0;
    const addTabBtn = document.getElementById('addTabBtn');
    const saveBtn = document.getElementById('saveBtn');
    const noteContent = document.getElementById('noteContent');
    const tabsContainer = document.querySelector('.tabs');
    
    let currentTabId = null;
    const notes = {};

    // Function to switch tabs
    function switchTab(tabId) {
        if (currentTabId) {
            notes[currentTabId] = noteContent.value;
        }

        currentTabId = tabId;
        noteContent.value = notes[tabId] || '';
        document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    }

    // Add a new tab
    addTabBtn.addEventListener('click', function() {
        tabCounter++;
        const tabId = 'tab' + tabCounter;

        const newTab = document.createElement('button');
        newTab.textContent = 'Note ' + tabCounter;
        newTab.id = tabId;
        newTab.classList.add('tab');
        newTab.addEventListener('click', function() {
            switchTab(tabId);
        });

        tabsContainer.insertBefore(newTab, addTabBtn);

        // Automatically switch to the new tab
        switchTab(tabId);
    });

    // Save current note
    saveBtn.addEventListener('click', function() {
        if (currentTabId) {
            notes[currentTabId] = noteContent.value;
            alert('Note saved!');
        }
    });

    // Initialize with one tab
    addTabBtn.click();
});
