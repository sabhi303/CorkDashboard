'use strict';

export function editHeader(options) {
    console.log(options)
    console.log(options.header)
    // Simulate the edit functionality
    const header = document.querySelector('h1.header span');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = header.innerText;
    input.classList.add('edit-header-input');

    header.parentNode.replaceChild(input, header);
    input.focus();

    input.addEventListener('blur', function() {
        const newHeader = document.createElement('span');
        newHeader.innerText = input.value;
        input.parentNode.replaceChild(newHeader, input);
    });
}

window.editHeader = editHeader;
