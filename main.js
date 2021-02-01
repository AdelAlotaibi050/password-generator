const draggable = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.container-box')
const to_remove = document.getElementById('to-remove')
const box_contain = document.getElementById('box-to-contain')
const password_content = document.getElementById('password_content');
const random_func = {
    uppercase: getRandomUpperCase,
    lowercase: getRandomLowerCase,
    numbers: getRandomNumber,
    special: getRandomSymbol
};
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

function getRandomUpperCase() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

function getRandomLowerCase() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48)
}

function getRandomSymbol() {
    const symbol = "!@#$%^&*(){}[]=<>/,.|~?"
    return symbol[Math.floor(Math.random() * symbol.length)]
}

function generate_password(uppercase, lowercase, numbers, special, length = 10) {

    let generatedPassword = ""
    const types_count = uppercase + lowercase + numbers + special
    const types_array = [{uppercase}, {lowercase}, {numbers}, {special}].filter(item => Object.values(item)[0])

    if (types_count === 0) {
        return ''
    }
    Array(length).fill(1).map(() => {
        types_array.map(type => {
            const funcName = Object.keys(type)[0]
            generatedPassword += random_func[funcName]()
        });
    })
    return generatedPassword.slice(0, length)
}


function showPassword() {
    const uppercase = box_contain.querySelector('#uppercase') != null
    const lowercase = box_contain.querySelector('#lowercase') != null
    const numbers = box_contain.querySelector('#numbers') != null
    const special = box_contain.querySelector('#special') != null
    const password = generate_password(uppercase, lowercase, numbers, special)
    if (password.length === 0) {
        return alert("الرجاء اختيار النمط المطلوب")
    }
    const h1_element = document.createElement("H1")
    const appended_password = document.createTextNode(password)
    h1_element.appendChild(appended_password)
    password_content.appendChild(h1_element)
    document.getElementById("password").style.height = "100%"
}

function HidePassword() {
    password_content.removeChild(password_content.getElementsByTagName('H1')[0]);
    document.getElementById("password").style.height = "0%";
}

