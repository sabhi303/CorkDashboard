'use strict';

export function editHeader(options) {
    console.log(options);

    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');

    // Create the form container
    const popupForm = document.createElement('div');
    popupForm.classList.add('popup-form');

    // Initialize form HTML
    let formHTML = `
        <h2>Edit Information</h2>
        <form id="popupForm">
    `;

    // Dynamically generate form fields based on options
    for (const [key, value] of Object.entries(options)) {
        if (key !== 'id' && key !== 'isEditable') {
            if (key === 'description' || key === 'additionalInfo') {
                formHTML += `
                    <div class="form-group">
                        <label for="${key}">${key.replace(/([A-Z])/g, ' $1')}</label>
                        <div id="toolbar-${key}"></div>
                        <div id="${key}" class="quill-editor"></div>
                    </div>
                `;
            } else {
                formHTML += `
                    <div class="form-group">
                        <label for="${key}">${key.replace(/([A-Z])/g, ' $1')}</label>
                        <input type="text" id="${key}" name="${key}" value="${value}" placeholder="Enter ${key.replace(/([A-Z])/g, ' $1')}">
                    </div>
                `;
            }
        }
    }

    formHTML += `
            <div class="form-group">
                <button type="submit">Submit</button>
                <button type="button" id="cancelButton">Cancel</button>
            </div>
        </form>
    `;

    // Set the form HTML
    popupForm.innerHTML = formHTML;

    // Append the form to the overlay
    overlay.appendChild(popupForm);

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Add Quill editor script and stylesheet
    const quillStylesheet = document.createElement('link');
    quillStylesheet.rel = 'stylesheet';
    quillStylesheet.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';

    const quillScript = document.createElement('script');
    quillScript.src = 'https://cdn.quilljs.com/1.3.6/quill.js';

    document.head.appendChild(quillStylesheet);
    document.head.appendChild(quillScript);

    quillScript.onload = function() {
        const quillEditors = {};
        for (const [key, value] of Object.entries(options)) {
            if (key === 'description' || key === 'additionalInfo') {
                quillEditors[key] = new Quill(`#${key}`, {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            [{ 'font': [] }, { 'size': [] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                            ['direction', { 'align': [] }],
                            ['link', 'formula'],
                            ['clean']
                        ]
                    }
                });
                quillEditors[key].root.innerHTML = value;
            }
        }

        document.getElementById('popupForm').addEventListener('submit', function(event) {
            event.preventDefault();

            // Collect form values
            const formData = {};
            for (const [key, value] of Object.entries(options)) {
                if (key === 'description' || key === 'additionalInfo') {
                    formData[key] = quillEditors[key].root.innerHTML;
                } else {
                    const inputElement = document.getElementById(key);
                    if (inputElement) {
                        formData[key] = inputElement.value;
                    }
                }
            }

            console.log('Form submitted!');
            console.log('Form Data:', formData);

            // Remove the overlay
            document.body.removeChild(overlay);
        });

        // Add event listener to the cancel button
        document.getElementById('cancelButton').addEventListener('click', function() {
            // Remove the overlay
            document.body.removeChild(overlay);
        });
    };

    // Add styles for the popup form and overlay
    const styles = document.createElement('style');
    styles.innerHTML = `
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            
        }
        .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: auto;
            z-index: 1000;
        }
        .popup-form {
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            width: 600px;
            max-height: 80vh;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
            overflow-y: auto;
        }
        .popup-form h2 {
            margin-top: 0;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
        }
        .form-group input[type="text"],
        .form-group input[type="email"] {
            width: calc(100% - 22px);
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 14px;
        }
        .form-group .ql-toolbar {
            border-radius: 3px 3px 0 0;
        }
        .form-group .ql-container {
            border-radius: 0 0 3px 3px;
            height: 200px;
        }
        .form-group button {
            background: #007BFF;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        }
        .form-group button:hover {
            background: #0056b3;
        }
        .form-group #cancelButton {
            background: #6c757d;
        }
        .form-group #cancelButton:hover {
            background: #5a6268;
        }
    `;

    document.head.appendChild(styles);
}

window.editHeader = editHeader;
