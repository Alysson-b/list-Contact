let contacts = [
    { id: 1, name: 'Abraão Sena', phone: '(11) 90876-1234', img: './assets/images.jfif' },
    { id: 2, name: 'Beatriz Clasen', phone: '(48) 90876-1123', img: '' },
    { id: 3, name: 'Brenda Mendes', phone: '(21) 90876-8765', img: '' },
    { id: 4, name: 'Caio Vinicios', phone: '(71) 90876-2435', img: '' },
    { id: 5, name: 'Cleiton Souza', phone: '(11) 90876-1209', img: '' },
    { id: 6, name: 'Daniel Duarte', phone: '(82) 90876-6534', img: '' }
];


const addButton = document.querySelector('.bx-plus').parentElement;
const editButton = document.querySelector('.bx-pencil').parentElement;
const deleteButton = document.querySelector('.bx-trash').parentElement;
const contactsList = document.querySelector('.lista');
const searchInput = document.querySelector('#filter');


function createModal(title, fields, onSubmit) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${title}</h2>
            <form id="contactForm">
                ${fields}
                <div class="modal-buttons">
                    <button type="submit">Confirmar</button>
                    <button type="button" class="cancel">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

   
    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        onSubmit(form);
        modal.remove();
    });

    
    modal.querySelector('.cancel').addEventListener('click', () => modal.remove());
}


function addContact() {
    const fields = `
        <input type="text" name="name" placeholder="Nome" required>
        <input type="tel" name="phone" placeholder="Telefone" required>
        <input type="text" name="img" placeholder="URL da imagem (opcional)">
    `;

    createModal('Adicionar Contato', fields, (form) => {
        const newContact = {
            id: Date.now(),
            name: form.name.value,
            phone: form.phone.value,
            img: form.img.value
        };
        contacts.push(newContact);
        renderContacts();
    });
}


function editContact() {
    if (!document.querySelector('.card.selected')) {
        alert('Selecione um contato para editar');
        return;
    }

    const selectedId = parseInt(document.querySelector('.card.selected').dataset.id);
    const contact = contacts.find(c => c.id === selectedId);

    const fields = `
        <input type="text" name="name" value="${contact.name}" required>
        <input type="tel" name="phone" value="${contact.phone}" required>
        <input type="text" name="img" value="${contact.img || ''}" placeholder="URL da imagem (opcional)">
    `;

    createModal('Editar Contato', fields, (form) => {
        contact.name = form.name.value;
        contact.phone = form.phone.value;
        contact.img = form.img.value;
        renderContacts();
    });
}


function deleteContact() {
    if (!document.querySelector('.card.selected')) {
        alert('Selecione um contato para excluir');
        return;
    }

    const selectedId = parseInt(document.querySelector('.card.selected').dataset.id);
    if (confirm('Tem certeza que deseja excluir este contato?')) {
        contacts = contacts.filter(c => c.id !== selectedId);
        renderContacts();
    }
}


function renderContacts(searchTerm = '') {

    let filteredContacts = contacts
        .filter(contact => 
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone.includes(searchTerm)
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    const groupedContacts = filteredContacts.reduce((groups, contact) => {
        const firstLetter = contact.name[0].toUpperCase();
        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push(contact);
        return groups;
    }, {});

    let html = '';
    Object.keys(groupedContacts).sort().forEach(letter => {
        html += `
            <div class="letter-group">
                <div class="section-header">
                    <span class="letter">${letter}</span>
                </div>
                <div class="group-content">
                    ${groupedContacts[letter].map(contact => `
                        <div class="card" data-id="${contact.id}">
                            <div class="avatar">
                                ${contact.img 
                                    ? `<img src="${contact.img}" alt="${contact.name}">`
                                    : `<div class="avatar-placeholder">${contact.name[0]}</div>`
                                }
                            </div>
                            <div class="dados">
                                <h2>${contact.name}</h2>
                                <p>${contact.phone}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    contactsList.innerHTML = html;

    
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
}


addButton.addEventListener('click', addContact);
editButton.addEventListener('click', editContact);
deleteButton.addEventListener('click', deleteContact);
searchInput.addEventListener('input', (e) => renderContacts(e.target.value));


renderContacts();