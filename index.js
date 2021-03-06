const $ = (element) => document.querySelector(element);
const $$ = (element) => document.querySelectorAll(element);

const notes = JSON.parse(localStorage.getItem('notes'))||[];
var currentNoteIid = 0;
var closeModalConf = false;
var excludeModal = false;
var isEditting = false;
var excludeTarget = 0;
var currentEditColor = '';

const setNewNote = (nt) => {
    localStorage.setItem('notes', JSON.stringify(nt));
    getAllNotes();
};

const time = () => {
    const months = ['Jan','Fev','Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    hours = hours.toString().length === 1 ? `0${hours}`: hours;
    minutes = minutes.toString().length == 1 ? `0${minutes}`: minutes;
    date = `${day} ${months[month]} ${hours}:${minutes}`;
    return date;
}

const saveNote = () => {
    let title = $('.new-note-container .input-title').value;
    let text  = $('.new-note-container .nt-area').value;
    let color = $('.new-note-container .c-palette').value;
    title = title === " " ? "Sem título" : title;
    color = color === '#000000' ? '#288a0b': color;
    
    isEditting && notes.unshift({
        "cardcolor": color === '#000000' ? currentEditColor: color,
        "date": time(),
        "title": title,
        "note": text
    });

    !isEditting && notes.unshift({
        "cardcolor": color,
        "date": time(),
        "title": title,
        "note": text
    });

    $('.new-note-container').classList.remove('new-note-container-show');
    setNewNote(notes);
}

$('.close-confirmation .close-conf-btn #y')
.addEventListener('click', ()=> {
    closeModalConf = true;
    $('.close-confirmation-modal').classList.remove('show-close-conf-modal');
    
    if(!isEditting) saveNote();
    else saveEdited();
})

$('.close-confirmation .close-conf-btn #n')
.addEventListener('click', ()=> {
    closeModalConf = false;
    $('.close-confirmation-modal').classList.remove('show-close-conf-modal');
    
    if(!isEditting) $('.new-note-container').classList.remove('new-note-container-show');
    else $('.edit-note-container').classList.remove('edit-note-container-show');
})

$('.exclude-confirmation .exclude-conf-btn #exclude')
.addEventListener('click', ()=> {
    excludeModal = true;
    deleteNote(excludeTarget)
    $('.exclude-confirmation-modal').classList.remove('show-exclude-conf-modal');
})

$('.exclude-confirmation .exclude-conf-btn #donot-exclude')
.addEventListener('click', ()=> {
    excludeModal = false;
    $('.exclude-confirmation-modal').classList.remove('show-exclude-conf-modal');
})

$('.new-note-container .close')
    .addEventListener('click', () => {
        let title = $('.new-note-container .input-title').value;
        let text = $('.new-note-container .nt-area').value;
        if(title || text){
            $('.close-confirmation-modal').classList.add('show-close-conf-modal')
        }else{
            $('.new-note-container').classList.remove('new-note-container-show');
        }
        return;
    });

const showAlert = (msg) => {
    $('.alert-modal .alert span').textContent = "";
    $('.alert-modal .alert button')
    .addEventListener('click', ()=>{
        $('.alert-modal').classList.remove('show-alert');
    });

    $('.alert-modal').classList.add('show-alert');
    $('.alert-modal .alert span').textContent = msg;
}


$('.new-note-container .fa-save')
.addEventListener('click', () => {
    t = $('.new-note-container .input-title').value;
    n = $('.new-note-container .nt-area').value;
    
    !n ? showAlert("Impossível salvar notas vazias!")
    :!t ? showAlert("Por favor insira um título")
    :t && n && saveNote();
});

let tempNote = {};
$('.edit-note-container .close-edit')
    .addEventListener('click', () => {
        isEditting = true;
        let title = $('.edit-note-container .input-title').value;
        let text = $('.edit-note-container .nt-area').value;
        
        if(title !== tempNote.title || text !== tempNote.note){
            $('.close-confirmation-modal').classList.add('show-close-conf-modal')
            return;
        }
        $('.edit-note-container').classList.remove('edit-note-container-show');
});


function editNote(id) {
    const note = notes[id];
    tempNote = note;
    isEditting = true;
    currentNoteIid = id;
    currentEditColor = note.cardcolor;
    $('.edit-note-container .input-title').value = note.title;
    $('.edit-note-container .nt-area').value = note.note;
    $('.edit-note-container .edit-note').style.backgroundColor = currentEditColor;
    $('.edit-note-container .nt-area').style.backgroundColor = currentEditColor;
    $('.edit-note-container .edit-palette').value = currentEditColor;
    $('.edit-note-container').classList.add('edit-note-container-show');
}


const setCardColor = (index, color) => {
    let note = notes[index];
   
    notes[index] = { 
        "cardcolor": color,
        "date": time(),
        "title": note.title,
        "note": note.note
    };
   
    setNewNote(notes);
}

const saveEdited = () => {
    const title  = $('.edit-note-container .input-title').value || "Sem título";
    const text   = $('.edit-note-container .nt-area').value || "";
    let newColor = $('.edit-note-container .edit-palette').value;
    
    newColor = newColor === currentEditColor ? currentEditColor : newColor;
   
    notes.splice(currentNoteIid, 1)
    notes.unshift({ "cardcolor": newColor, "date": time(), "title": title, "note": text });

    $('.edit-note-container').classList.remove('edit-note-container-show');
    setNewNote(notes);
}


$('.edit-note-container .fa-save')
    .addEventListener('click', () => saveEdited());


const deleteNote = (target) => {
    notes.splice(target, 1);
    notes.length === 0 && $('.msg').classList.remove('hide-msg');
    setNewNote(notes);
}

$('.new-note-btn').addEventListener('click', () => {    
    $('.new-note-container').classList.add('new-note-container-show');
    $('.new-note-container .input-title').value="";
    $('.new-note-container .nt-area').value="";
});    

const getAllNotes = () => {
    $$('.notes-container .notes').forEach(item => item.remove());
   
    notes.forEach((note, index) => {
        const noteClone = $('.notes').cloneNode(true);
        
        let title = note.title;
        title = title.length >= 20 ? title.substring(0, 17)+'..': title;
        
        noteClone.style.backgroundColor = note.cardcolor;
        noteClone.querySelector('.notes-title-text').textContent = title;
        noteClone.querySelector('.notes-text').textContent = note.note;
        noteClone.querySelector('.edited span').textContent = note.date;
        
        noteClone.querySelector('.delete')
            .addEventListener('click', () => {
                $('.exclude-confirmation-modal').classList.add('show-exclude-conf-modal');
                excludeTarget = index;
            });

        noteClone.querySelector('.edit')
            .addEventListener('click', () => {
                editNote(index);
            });

         ['.notes-preview', '.notes-title'].forEach(item => {
            noteClone.querySelector(item)
            .addEventListener('click', () => {
                editNote(index);
            });
        });

        noteClone.querySelector('.palette')
        .addEventListener('input', e => {
            let color = e.target.value;
            setCardColor(index, color);
        });
        
        $('.notes-container').appendChild(noteClone);   
    });
    
    $$('.notes-container .notes').length > 0 && $('.msg').classList.add('hide-msg');
}

getAllNotes();
