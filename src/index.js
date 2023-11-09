import "./style.css";

const ul = document.querySelector("ul");
const form = document.querySelector("form");
const input = document.querySelector("form > input"); // input principal "Ajouter"

const todos = [
    {
        text: "Je suis une todo",
        done: false,
        editMode: false,
    },
    {
        text: "faire du javascript",
        done: true,
        editMode: false,
    },
];

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value;
    input.value = "";
    addTodo(text);
});

const displayTodo = () => {
    const todosNode = todos.map((todo, index) => {
        if (todo.editMode) {
            return createTodoEditElement(todo, index);
        } else {
            return createTodoElement(todo, index);
        }
    });
    ul.innerHTML = "";
    ul.append(...todosNode);
};

/**
 * Création d'un élément Todo
 * @param {{text: string, done:boolean, editMode: boolean}} todo objet contenu dans le tableau todos
 * @param {number} index nombre index de l'objet courant
 * @returns {HTMLLIElement} Retour de l'élément HTML "li" en mode normal
 */
const createTodoElement = (todo, index) => {
    const li = document.createElement("li");

    const buttonDelete = document.createElement("button");
    buttonDelete.innerText = "Supprimer";
    buttonDelete.className = "danger";
    buttonDelete.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        deleTodo(index);
    });

    const buttonEdit = document.createElement("button");
    buttonEdit.innerText = "Éditer";
    buttonEdit.className = "primary";
    buttonEdit.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleEditMode(index);
    });

    li.innerHTML = `
        <span class="todo ${todo.done ? "done" : ""}"></span>
        <p class="${todo.done ? "done" : ""}">${todo.text}</p>
    `;
    li.append(buttonEdit, buttonDelete);
    // écouteur sur li qui appelle la fonction toggleTodo "changement de status de la todo" ou la fonction toggleEditMode "mode édition"
    let timer; // variable pour conserver la référence du timer
    li.addEventListener("click", (event) => {
        event.preventDefault();
        /*  Si c'est le premier clic nous allons lancer un timer et conserver sa référence. Il va permettre d'exécuter la fonction de rappel au bout de 200 millisecondes. 
         Si c'est le second ou plus, nous allons supprimer le timer et activer le mode édition. 
          Au bout de 200 millisecondes, si il n'y a pas eu plus d'un clic, alors le timer n'a pas été annulé et la fonction de rappel est exécutée. Celle-ci va ensuite exécuter 
        */
        if (event.detail === 1) {
            timer = setTimeout(() => {
                toggleTodo(index);
            }, 200);
        } else if (event.detail > 1) {
            clearTimeout(timer);
            toggleEditMode(index);
        }
    });
    return li;
};

/**
 * Création d'un élément Todo en mode édition
 * @param {{text: string, done:boolean, editMode: boolean}} todo objet contenu dans le tableau todos
 * @param {number} index nombre index de l'objet courant
 * @returns {HTMLLIElement} Retour de l'élément HTML "li" en mode edit
 */
const createTodoEditElement = (todo, index) => {
    const li = document.createElement("li");
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = todo.text;

    const buttonSave = document.createElement("button");
    buttonSave.innerText = "Enregistrer";
    buttonSave.className = "success";
    buttonSave.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        editTodo(index, editInput);
        // Fonction asynchrone pour focus le champ input principal après sont ajout dans le dom par la fonction displayTodo()
        setTimeout(() => {
            input.focus();
        }, 200);
    });

    // Ajout d'un écouteur sur l'input pour pouvoir enregistrer avec la touche entrée
    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            editTodo(index, editInput);
        } else if (event.key === "Escape") {
        }
    });

    const buttonCancel = document.createElement("button");
    buttonCancel.innerText = "Annuler";
    buttonCancel.className = "primary";
    buttonCancel.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleEditMode(index);
        // Fonction asynchrone pour focus le champ input principal après sont ajout dans le dom par la fonction displayTodo()
        setTimeout(() => {
            input.focus();
        }, 200);
    });
    li.append(editInput, buttonCancel, buttonSave);

    // Fonction asynchrone pour focus le champ edit après sont ajout dans le dom par la fonction displayTodo()
    setTimeout(() => {
        editInput.focus();
    }, 200);

    return li;
};

/**
 * Ajout d'une todo en empêchant l'entrée d'une chaîne vide
 * @param {string} text
 */
const addTodo = (text) => {
    text = text.trim(); // méthode trim() supprime les espaces vides avant et après une chaîne de caractères
    if (text) {
        todos.push({
            text: `${text[0].toUpperCase()}${text.slice(1)}`,
            // Interpolation en mode littéral pour avoir une majuscule sur le premier caractère méthode toUpperCase() et la suite de toute la chaîne de caractères à partir de l'index 1 avec la méthode slice()
            done: false,
        });
    }

    displayTodo();
};

/**
 * Suppression d'une todo
 * @param {number} index nombre de l'index de la todo
 */
const deleTodo = (index) => {
    todos.splice(index, 1);
    displayTodo();
};

/**
 * Changement de status d'un todo
 * @param {number} index nombre de l'index de la todo
 */
const toggleTodo = (index) => {
    todos[index].done = !todos[index].done;
    displayTodo();
};

/**
 * Passage d'une todo en mode édition
 * @param {number} index nombre de l'index de la todo
 */
const toggleEditMode = (index) => {
    todos[index].editMode = !todos[index].editMode;
    displayTodo();
};

// Modification du texte d'une todo en mode edition
/**
 *
 * @param {number} index
 * @param {HTMLInputElement} input
 */
const editTodo = (index, input) => {
    const value = input.value;
    todos[index].text = value;
    todos[index].editMode = false;
    displayTodo();
};

displayTodo();
