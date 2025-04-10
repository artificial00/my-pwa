// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker зарегистрирован:', registration.scope);
        } catch (err) {
            console.error('Ошибка регистрации:', err);
        }
    });
}

// Логика приложения
document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');
    const offlineStatus = document.getElementById('offline-status');

    // Проверка онлайн-статуса
    function updateOnlineStatus() {
        if (navigator.onLine) {
            offlineStatus.textContent = 'Онлайн';
            offlineStatus.classList.remove('offline');
            offlineStatus.classList.add('online');
        } else {
            offlineStatus.textContent = 'Офлайн-режим';
            offlineStatus.classList.remove('online');
            offlineStatus.classList.add('offline');
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Загрузка заметок
    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notesList.innerHTML = '';
        
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <button class="delete-btn" data-index="${index}">×</button>
                <div class="note-text">${note.text}</div>
                <div class="note-date">${new Date(note.date).toLocaleString()}</div>
            `;
            notesList.appendChild(noteElement);
        });

        // Добавляем обработчики удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteNote(index);
            });
        });
    }

    // Добавление заметки
    function addNote() {
        const text = noteInput.value.trim();
        if (!text) return;

        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push({
            text,
            date: new Date().toISOString()
        });

        localStorage.setItem('notes', JSON.stringify(notes));
        noteInput.value = '';
        loadNotes();
    }

    // Удаление заметки
    function deleteNote(index) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }

    // Обработчики событий
    addNoteBtn.addEventListener('click', addNote);
    noteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addNote();
        }
    });

    // Первоначальная загрузка
    loadNotes();
});