const draggables = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.container-box')
const toremove = document.getElementById('to-remove')
const uppercase = document.getElementById('uppercase')
const lowercase = document.getElementById('lowercase')
const numbers = document.getElementById('numbers')
const special = document.getElementById('special')
const boxtocontain = document.getElementById('box-to-contain')
const password_content = document.getElementById('password_content');
draggables.forEach(draggable => {
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
      toremove.remove();
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
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

function genCharArray(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
} 
function generate_password() {
    var password = [];
    var len =  Math.floor(Math.random() * 10) + 5;
    
    if (boxtocontain.querySelector('#numbers') != null) {
          var numbers = ['0','1','2','3','4','5','6','7','8','9']
          password.push(numbers);
    }
    if (boxtocontain.querySelector('#uppercase') != null) {
       var uppercase = genCharArray('A', 'Z');
       password.push(uppercase);
    }

    if (boxtocontain.querySelector('#lowercase') != null) {
     var lowercase = genCharArray('a', 'z');
     password.push(lowercase);
    }

    if (boxtocontain.querySelector('#special') != null) {
      var special = ['~', '!','@','#','$','%','^','&','*','(',')','+','_','-','{','}','/','[',']','’']
      password.push(special);
    }
    var the_password = "";
    for(var i = 0; i <=len; i ++) {
      if (password.length === 0) {
        password.push(['~', '!','@','#','$','%','^','&','0','1','2','3','4','a','R','k','L']);

      }
      var start_array_len = Math.floor(Math.random() * password.length);
      var randomItem = password[start_array_len][Math.floor(Math.random()*password[start_array_len].length)]; 
      the_password +=randomItem;
        
    }
      var h1_element = document.createElement("H1")                
      var appended_password = document.createTextNode(the_password);
      h1_element.appendChild(appended_password);
      password_content.appendChild(h1_element);  
}

function showPassword() {
  generate_password();
  document.getElementById("password").style.height = "100%";
}

function HidePassword() {
  password_content.removeChild(password_content.getElementsByTagName('h1')[0]);
  document.getElementById("password").style.height = "0%";
}

