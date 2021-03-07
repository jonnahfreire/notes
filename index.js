const $ = (element) => document.querySelector(element);
const $$ = (element) => document.querySelectorAll(element);

const notes = JSON.parse(localStorage.getItem('notes'))||[];
let currentNoteIid = 0;
let closeModalConf = false;
let closeModalIsClosed = true;
let isEditting = false;

const setNewNote = () => localStorage.setItem('notes', JSON.stringify(notes));

const saveNote = () => {
    let title = $('.new-note-container .input-title').value || "Sem título";
    let text = $('.new-note-container .nt-area').value || "";
    
    notes.push({ "title": title, "note": text });
    $('.new-note-container').classList.remove('new-note-container-show');

    setNewNote();
    getAllNotes();
}

$('.close-confirmation').querySelector('.close-conf-btn #y')
.addEventListener('click', ()=> {
    closeModalConf = true;
    $('.close-confirmation-modal').classList.remove('show-close-conf-modal');
    closeModalIsClosed = true;
    
    if(!isEditting) saveNote();
    else saveEdited();
})

$('.close-confirmation').querySelector('.close-conf-btn #n')
.addEventListener('click', ()=> {
    closeModalConf = false;
    $('.close-confirmation-modal').classList.remove('show-close-conf-modal');
    
    if(!isEditting) $('.new-note-container').classList.remove('new-note-container-show');
    else $('.edit-note-container').classList.remove('edit-note-container-show');
})


$('.new-note-container').querySelector('.close')
    .addEventListener('click', () => {
        let title = $('.new-note-container').querySelector('.input-title').value;
        let text = $('.new-note-container').querySelector('.nt-area').value;
        if(title || text){
            $('.close-confirmation-modal').classList.add('show-close-conf-modal')
           
        }else{
            $('.new-note-container').classList.remove('new-note-container-show');
        }
        return;
    });

$('.new-note-btn').addEventListener('click', () => {    
    $('.new-note-container').classList.add('new-note-container-show');
    $('.new-note-container').querySelector('.input-title').value="";
    $('.new-note-container').querySelector('.nt-area').value="";
});    


$('.new-note-container').querySelector('.save')
.addEventListener('click', () => {
    saveNote();
});


$('.edit-note-container').querySelector('.close-edit')
    .addEventListener('click', () => {
        isEditting = true;
        let title = $('.edit-note-container').querySelector('.input-title').value;
        let text = $('.edit-note-container').querySelector('.nt-area').value;
        
        if(title || text){
            $('.close-confirmation-modal').classList.add('show-close-conf-modal')
           
        }else{
            $('.edit-note-container').classList.remove('edit-note-container-show');
        }
        return;
});


function editNote(id) {
    currentNoteIid = id;
    const note = notes[id];
    const editContainer = $('.edit-note-container');
    editContainer.querySelector('.input-title').value = note.title;
    editContainer.querySelector('.nt-area').value = note.note;
    editContainer.classList.add('edit-note-container-show');
}

const saveEdited = () => {
    const title = $('.edit-note-container').querySelector('.input-title').value || "Sem título";
    const text = $('.edit-note-container').querySelector('.nt-area').value || "";
    
    notes[currentNoteIid] = { "title": title, "note": text };

    localStorage.setItem('notes', JSON.stringify(notes));
    $('.edit-note-container').classList.remove('edit-note-container-show');
    getAllNotes();
}

$('.edit-note-container').querySelector('.save-edit')
    .addEventListener('click', () => saveEdited());


const deleteNote = (target) => {
    notes.splice(target, 1);
    setNewNote();

    notes.length === 0 && $('.msg').classList.remove('hide-msg');
    getAllNotes();
}


const getAllNotes = () => {
    $$('.notes-container .notes').forEach(item => item.remove());
   
    notes.forEach((note, index) => {
        const noteClone = $('.notes').cloneNode(true);
        noteClone.querySelector('.notes-title-text').textContent = note.title;
        noteClone.querySelector('.notes-text').textContent = note.note;
        
        noteClone.querySelector('.delete')
            .addEventListener('click', () => {
                deleteNote(index);
            });

        noteClone.querySelector('.edit')
            .addEventListener('click', () => {
                editNote(index);
            });

        noteClone.addEventListener('dblclick', () => {
            editNote(index);
        });
        
        $('.notes-container').appendChild(noteClone);   
    })
    
    $$('.notes-container .notes').length > 0 && $('.msg').classList.add('hide-msg');
}

getAllNotes();
