const inputField = document.querySelector('#inputField');
const addButton = document.querySelector('#addButton');
const container = document.getElementById('container');
let todoArr = [];
let canEdit = true;


window.addEventListener('load', render);
function render() {
  container.innerHTML = '';
  todoArr.forEach(item => {
    appendItem(item);
  })
}

addButton.addEventListener('click', ()=> {
  if(!inputField.value) return;

  let lastTodo = null;
  if(todoArr.length) {
    lastTodo = todoArr[todoArr.length - 1]
  } else {
   lastTodo = { id: 0 }
  }

  const item = { 
    id: lastTodo.id + 1, 
    value: inputField.value
  };

  todoArr.push(item);
  inputField.value = '';
  setLocalStorage();

  render();
});

const createTodotext = (item) => {
  const todoText = document.createElement('div');
  todoText.classList.add('todo-text');
  todoText.textContent = item.value;

  return todoText;
}

function createButton(element, className, content) {
  let button = document.createElement(element);
  button.classList.add(className)
  button.textContent = content;

  return button;
}


function appendItem(item) {
  const todoItem = document.createElement('li');
  todoItem.classList.add('item');
  todoItem.setAttribute('id', `name${item.id}`);
  todoItem.appendChild(createTodotext(item));

  const itemButtonsHolder = document.createElement('div');
  itemButtonsHolder.classList.add('item-buttons-holder');
  todoItem.appendChild(itemButtonsHolder);

  const deleteButton = createButton('span', 'delete-button' ,'-')
  itemButtonsHolder.appendChild(deleteButton)

  deleteButton.addEventListener('click', () => {
   const i = todoArr.findIndex(({id}) => id == item.id)
    todoArr.splice(i, 1);
    setLocalStorage();
    render();
  });

  const editButton = createButton('span', 'edit-button', '...')
  itemButtonsHolder.appendChild(editButton);

  editButton.addEventListener('click', () =>{
    if(canEdit) {
      editItem(item.id);
      canEdit = false;
      setLocalStorage();
    }
  })

  const doneButton = createButton('span', 'done-button', 'V')
  itemButtonsHolder.appendChild(doneButton);

  doneButton.addEventListener('click', () => {
    doneItem(item.id);
    setLocalStorage();
  });

  if(item.isDone) {
    todoItem.classList.add('item-done');
  }

  todoItem.setAttribute('identificator', item.id)
  container.appendChild(todoItem)
}



function removeItem(identificator) {
  const selectedItem = document.getElementById(`name${identificator}`);
  if(!selectedItem) return;
  selectedItem.remove();
};

function editItem(identificator) {  
  const selectedTodoText = document.querySelector(`#name${identificator} .todo-text`);
  const selectedItem = document.querySelector(`#name${identificator}`);
  selectedItem.classList.remove('item-done');

  const item = todoArr.find(({id}) => id == identificator);
  let itemValue = item.value;

  const todoInput = document.createElement('input');
  todoInput.value = itemValue;
  todoInput.classList.add('selected-todo-input');
  selectedTodoText.style.display = 'none';

  selectedItem.appendChild(todoInput);

  itemValue = todoInput.value;
  
  const saveButton = createButton('span', 'save-button', '+')
  selectedItem.appendChild(saveButton);

  saveButton.addEventListener('click', () => {
      if(!todoInput) return;
      
      itemValue = todoInput.value;
      item.value = itemValue;
      render();
      canEdit = true;
  })
}

function doneItem(identificator){
  const item = todoArr.find(({id}) => id == identificator)
  item.isDone = true;
  render();
}

function setLocalStorage(){
  localStorage.setItem('todoArr', JSON.stringify(todoArr));
}

 todoArr = localStorage.getItem('todoArr');
 todoArr = todoArr?JSON.parse(todoArr) : [];









