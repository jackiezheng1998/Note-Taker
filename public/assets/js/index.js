const noteTitle = document.querySelector('.note-title');
const noteText = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');
const noteList = document.querySelectorAll('.list-container .list-group');

const hideElement = (elem) => {
  elem.style.display = 'none';
};

const showElement = (elem) => {
  elem.style.display = 'inline';
};

let activeNote = {};

const fetchNotes = () => {
  return fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const postNote = (note) => {
  return fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });
};

const removeNote = (id) => {
  return fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
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
    fetchAndDisplayNotes();
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
    fetchAndDisplayNotes();
    displayActiveNote();
  });
};

const handleViewNote = (event) => {
  event.preventDefault();
  activeNote = JSON.parse(event.target.parentElement.getAttribute('data-note'));
  displayActiveNote();
};

const handleNewNote = (event) => {
  activeNote = {};
  displayActiveNote();
};
