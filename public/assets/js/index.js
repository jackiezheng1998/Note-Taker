let noteTitle = document.querySelector('.note-title');
let noteText = document.querySelector('.note-textarea');
let saveNoteBtn = document.querySelector('.save-note');
let newNoteBtn = document.querySelector('.new-note');
let noteList = document.querySelectorAll('.list-container .list-group');

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

const hideElement = (elem) => {
  elem.style.display = 'none';
};

const showElement = (elem) => {
  elem.style.display = 'inline';
};

let activeNote = {};

const getNotes = () => {
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};


const postNote = (note) => {
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });
};


const removeNote = (id) => {
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};


const displayActiveNote = () => {
  hideElement(saveNoteBtn);
  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleSaveNote = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  postNote(newNote).then(() => {
    getAndDisplayNotes();
    displayActiveNote();
  });
};

const handleDeleteNote = (event) => {
  event.stopPropagation();
  const note = event.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
  if (activeNote.id === noteId) {
    activeNote = {};
  }
  
  removeNote(noteId).then(() => {
    getAndDisplayNotes();
    displayActiveNote();
  });
};

const handleViewNote = (event) => {
  event.preventDefault();
  activeNote = JSON.parse(event.target.parentElement.getAttribute('data-note'));
  displayActiveNote();
};

const handleNewViewNote = (event) => {
  activeNote = {};
  displayActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hideElement(saveNoteBtn);
  } else {
    showElement(saveNoteBtn);
  }
};

const displayNoteList = async (notes) => {
  let Notes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

let noteItemsList = [];

  const li = createListItem = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('font-weight-bold');
    spanEl.innerText = text;
    li.addEventListener('click', handleViewNote);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
      delBtnEl.addEventListener('click', handleDeleteNote);
      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (notes.length === 0) {
    noteItemsList.push(createListItem('No saved Notes', false));
  }

  notes.forEach((note) => {
    const li = createListItem(note.title);
    li.dataset.note = JSON.stringify(note);

    noteItemsList.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteItemsList.forEach((note) => noteList[0].append(note));
  }
};

const getAndDisplayNotes = () => getNotes().then(displayNoteList);

if (window.location.pathname === '/notes') {

  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
  saveNoteBtn.addEventListener('click', handleSaveNote);
  newNoteBtn.addEventListener('click', handleNewViewNote);
}

getAndDisplayNotes();