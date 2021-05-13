const { getAllLangs, buildCurLayoutMap } = require("../layouts/build");
const path = require('path');
const { ipcRenderer } = require('electron');
const { SIGPWR } = require("constants");


var curLayout = new Map();

//tabs and its content
const tabs = document.querySelectorAll('.tabs li');
const tabContent = document.querySelectorAll('#tabs-content > div');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {

        tabs.forEach(item => item.classList.remove('is-active'))
        tab.classList.add('is-active');

        const target = tab.dataset.target;
        tabContent.forEach(box => {
            if (box.getAttribute('id') === target) {
                box.classList.remove('is-hidden');
            } else {
                box.classList.add('is-hidden')
            }
        });
    })
})


//Show langs in the dropdown list
const dropdown = document.querySelectorAll('.list');
dropdown.forEach((list) => {

    // remove list
    while (list.lastElementChild) {
        list.removeChild(list.lastElementChild);
    }
    // make the list 
    for (let lang of getAllLangs()) {
        let opt = document.createElement('option');
        let textnode = document.createTextNode(lang);
        opt.appendChild(textnode);
        list.appendChild(opt)
    }

})

//Update choosen langs when add or remove


//Get the current choosen lags
function getChoosenLangs() {
    let langs = new Array()
    dropdown.forEach((list) => {
        langs.push(list.options[list.selectedIndex].value);
    })
    return langs;
}


// Setup Switches - when value ture == on / value false == off
function switchvalue(item) {
    let swt = item.firstElementChild;
    let inputBox = item.nextElementSibling ? item.nextElementSibling.firstElementChild : false;
    if (swt.getAttribute('value') == 'true') {
        swt.removeAttribute("checked")
        swt.setAttribute('value', 'false')
        if (inputBox) {
            inputBox.setAttribute('disabled', "")
        }
        ipcRenderer.send('deactivate-setting', item.getAttribute('name'))
    } else {
        swt.setAttribute('checked', "")
        swt.setAttribute('value', 'true')
        if (inputBox) {
            inputBox.removeAttribute("disabled")
        }
        ipcRenderer.send('activate-setting', item.getAttribute('name'))
    }
}

//Radio for undefined character
const radio = document.querySelectorAll('.radio > input');

radio.forEach((item) => {
    item.addEventListener('click', () => {

        radio.forEach(item => {
            item.removeAttribute("checked")
        })

        item.setAttribute('checked', "")
        ipcRenderer.send('update-undefinedCharOption', item.getAttribute('name'), item.getAttribute('value'))

    })
})


function reportKeyEvent(input, zEvent) {
    input.removeAttribute('value', "")

    var keyStr = ["Control", "Shift", "Alt", "Meta"].includes(zEvent.key) ? "" : zEvent.key.toUpperCase() + " ";
    var reportStr =
        (zEvent.ctrlKey ? "CmdOrCtrl+" : "") +
        (zEvent.shiftKey ? "Shift+" : "") +
        (zEvent.altKey ? "Alt+" : "") +
        (zEvent.metaKey ? "Meta+" : "") +
        keyStr.toUpperCase();

    input.setAttribute('value', reportStr)

}


// Shortcut input field. Take the input and update shortcut
function updateShortcut(item) {
    let parentName = item.parentElement.getAttribute('name');
    let newShortcut = item.getAttribute('value')
    ipcRenderer.send('update-shortcutKeys', parentName, newShortcut)
}

const fields = document.querySelectorAll('.field');

function startDefSetting() {

    ipcRenderer.send('defSetting')

}

// Put default settings whens strat the app
ipcRenderer.on('getDefSettings', (event, defSettings) => {

    let swt = new Array();
    let inputBox = new Array();
    let defLangs = [defSettings[defSettings.length - 1].firstLang, defSettings[defSettings.length - 1].secondLang];


    fields.forEach((item) => {
        swt.push(item.firstElementChild);
        inputBox.push(item.nextElementSibling ? item.nextElementSibling.firstElementChild : false);
    })

    for (let i = 0; i < defSettings.length - 2; i++) {
        if (defSettings[i].active == false) {
            swt[i].removeAttribute("checked")
            swt[i].setAttribute('value', 'false')
            if (inputBox[i]) {
                inputBox[i].setAttribute('disabled', "")
                inputBox[i].setAttribute('value', defSettings[i].shortcut)
            }
        } else if (defSettings[i].active == true) {
            swt[i].setAttribute('checked', "")
            swt[i].setAttribute('value', 'true')
            if (inputBox[i]) {
                inputBox[i].removeAttribute("disabled")
                inputBox[i].setAttribute('value', defSettings[i].shortcut)
            }
        }
    }

    radio.forEach((item) => {

        item.value == defSettings[3].undefinedCharOption ? item.checked = true : item.checked = false;
    })


    for (let i = 0; i < defLangs.length; i++) {
        var sel = dropdown[i]
        var opts = sel.options;
        for (var opt, j = 0; opt = opts[j]; j++) {
            if (opt.value == defLangs[i]) {
                sel.selectedIndex = j;
                break;
            }
        }
    }

    boxes.forEach((box) => {
        var startText = document.createElement("p");
        startText.innerHTML = "Make your writing easier. <br> ";
        box.appendChild(startText);
    })

    updateMainLayout()

})


// when the dropdown x create the curlayoutmap
function updateMainLayout() {
    curLayout = buildCurLayoutMap(getChoosenLangs())
    ipcRenderer.send('curLayout', curLayout, getChoosenLangs())
}

const startedText = document.querySelectorAll('.text');
const boxes = document.querySelectorAll('.box');

ipcRenderer.on('newText', (event, before, reverse, lang) => {

    boxes.forEach((box) => {
        var devider = document.createElement("div");
        devider.className = 'is-divider my-4';
        box.insertBefore(devider, box.firstChild)
    })

    var newBefore = document.createElement("p");
    var beforeText = document.createTextNode(before);
    newBefore.appendChild(beforeText);

    var newReverse = document.createElement("p");
    var reverseText = document.createTextNode(reverse);
    newReverse.appendChild(reverseText);


    if (lang == 1) {
        boxes[0].insertBefore(newBefore, boxes[0].firstChild)
        boxes[1].insertBefore(newReverse, boxes[1].firstChild)
    } else {

        boxes[1].insertBefore(newBefore, boxes[1].firstChild)
        boxes[0].insertBefore(newReverse, boxes[0].firstChild)
    }

})

function openInBrowser() {
    if (event.target.tagName.toLowerCase() === 'a' && event.target.protocol != 'file:') {
        event.preventDefault();
        require("electron").shell.openExternal(event.target.href);
    }
}