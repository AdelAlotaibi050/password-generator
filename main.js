const draggable = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.container-box')
const to_remove = document.getElementById('to-remove')
const box_contain = document.getElementById('box-to-contain')
const CHARACTER_SETS = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "!\"#$%" + String.fromCharCode(38) + "'()*+,-./:;" + String.fromCharCode(60) + "=>?@[\\]^_`{|}~"
];

let cryptoObject = null;
let currentPassword = null;


draggable.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
    })
})

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            container.appendChild(draggable)
            to_remove.remove();
        } else {
            container.insertBefore(draggable, afterElement)
        }
    })
})


function initCrypto() {

    if ("crypto" in window)
        cryptoObject = crypto;
    else if ("msCrypto" in window)
        cryptoObject = msCrypto;
    else
        return;

    if (!("getRandomValues" in cryptoObject) || !("Uint32Array" in window) || typeof Uint32Array != "function")
        cryptoObject = null;

}

function doGenerate(uppercase, lowercase, numbers, special, length = 10) {


    // Get and check character set
    const charset = getPasswordCharacterSet(uppercase, lowercase, numbers, special);
    if (charset.length <= 1) {
        return null;
    }

    // Check length
    if (length < 2) {
        alert("طول كلمة المرور جدا قصير");
        return;
    } else if (length > 50) {
        alert("طول كلمة المرور جدا كبير");
        return;
    }

    // Generate password
    currentPassword = generatePassword(charset, length);

    return currentPassword;

}

/*-- Low-level functions --*/
function getPasswordCharacterSet(uppercase, lowercase, numbers, special) {
    let rawCharset = "";
    const types_array = [uppercase, lowercase, numbers, special]

    types_array.forEach(function (entry, i) {
        if (entry)
            rawCharset += CHARACTER_SETS[i]
    });
    // Parse UTF-16, remove duplicates, convert to array of strings
    const charset = [];
    for (let i = 0; rawCharset.length > i; i++) {
        const c = rawCharset.charCodeAt(i);
        if (0xD800 > c || c >= 0xE000) { // Regular UTF-16 character
            let s = rawCharset.charAt(i);
            if (charset.indexOf(s) === -1)
                charset.push(s);
            continue;
        }
        if (0xDC00 > c ? rawCharset.length > i + 1 : false) { // High surrogate
            let d = rawCharset.charCodeAt(i + 1);
            if (d >= 0xDC00 ? 0xE000 > d : false) { // Low surrogate
                let s = rawCharset.substring(i, i + 2);
                i++;
                if (charset.indexOf(s) === -1)
                    charset.push(s);
                continue;
            }
        }
        throw "Invalid UTF-16";
    }
    return charset;
}


function generatePassword(charset, len) {
    let result = "";
    for (let i = 0; len > i; i++)
        result += charset[randomInt(charset.length)];
    return result;
}

function randomInt(n) {
    let x = randomIntMathRandom(n);
    x = (x + randomIntBrowserCrypto(n)) % n;
    return x;
}

// Uses a secure, unpredictable random number generator if available; otherwise returns 0.
function randomIntBrowserCrypto(n) {
    if (cryptoObject == null)
        return 0;
    // Generate an unbiased sample
    let x = new Uint32Array(1);
    do cryptoObject.getRandomValues(x);
    while (x[0] - x[0] % n > 4294967296 - n);
    return x[0] % n;
}

function randomIntMathRandom(n) {
    let x = Math.floor(Math.random() * n);
    if (0 > x || x >= n)
        throw "Arithmetic exception";
    return x;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child};
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}


function showPassword() {
    const uppercase = box_contain.querySelector('#uppercase') != null
    const lowercase = box_contain.querySelector('#lowercase') != null
    const numbers = box_contain.querySelector('#numbers') != null
    const special = box_contain.querySelector('#special') != null
    const length = parseInt(document.getElementById("length").value, 10)
    const password = doGenerate(uppercase, lowercase, numbers, special, length)
    if (password == null) {
        return alert("الرجاء اختيار النمط المطلوب")
    }
    const h1_element = document.createElement("H1")
    const appended_password = document.createTextNode(password)
    h1_element.appendChild(appended_password)
    document.getElementById('password_content').appendChild(h1_element)
    document.getElementById("password").style.height = "100%"

    // Password strngth
    var result = zxcvbn(currentPassword);
    showPasswordStrength(result, h1_element);

}

function showPasswordStrength(result, h1_element) {
    if (result.score === 0) {
        h1_element.style.color = "rgb(241, 155, 43)";
    } else if (result.score === 1) {
        h1_element.style.color = "rgb(216, 209, 69)";
    } else if (result.score === 2) {
        h1_element.style.color = "rgb(152, 203, 111)";
    } else if (result.score === 3) {
        h1_element.style.color = "rgb(95, 216, 137)";
    } else if (result.score === 4) {
        h1_element.style.color = "rgb(95, 216, 137)";
    }
}

function hidePassword() {
    const password_content = document.getElementById('password_content')
    password_content.removeChild(password_content.getElementsByTagName('H1')[0]);
    document.getElementById("password").style.height = "0%";
}


initCrypto();
