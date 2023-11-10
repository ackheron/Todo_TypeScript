// IMPORTER UN FICHIER CSS QUI CONTIENT LE STYLE DU DOCUMENT HTML
import "./style.css";

// SÉLECTIONNER LES ÉLÉMENTS HTML UL, FORM ET INPUT
const ul = document.querySelector("ul");
const form = document.querySelector("form");
const input = document.querySelector<HTMLInputElement>("form > input"); // input principal "Ajouter"

let timer: number;

// Définir un tableau todos qui contient des objets représentant des tâches à faire
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

// AJOUTER UN ÉCOUTEUR D'ÉVÉNEMENT SUBMIT SUR L'ÉLÉMENT FORM QUI APPELLE UNE FONCTION ANONYME LORSQU'UN FORMULAIRE EST SOUMIS
form.addEventListener("submit", (event) => {
    // Empêcher le comportement par défaut du formulaire (qui est de recharger la page)
    event.preventDefault();
    // Récupérer la valeur de l'élément input qui contient le texte de la nouvelle tâche à ajouter
    const text = input.value;
    // Réinitialiser la valeur de l'élément input à une chaîne vide
    input.value = "";
    // Appeler la fonction addTodo en lui passant la valeur de l'élément input
    addTodo(text);
});

// DÉFINIR UNE FONCTION DISPLAYTODO QUI AFFICHE LA LISTE DES TÂCHES À L'ÉCRAN
const displayTodo = () => {
    // Créer un tableau todosNode qui contient des éléments HTML li représentant chaque tâche du tableau todos
    const todosNode = todos.map((todo, index) => {
        // Vérifier si la propriété editMode de l'objet todo est vraie ou fausse
        if (todo.editMode) {
            // Si elle est vraie, appeler la fonction createTodoEditElement qui crée un élément HTML li en mode édition
            return createTodoEditElement(todo, index);
        } else {
            // Si elle est fausse, appeler la fonction createTodoElement qui crée un élément HTML li en mode normal
            return createTodoElement(todo, index);
        }
    });
    // Vider le contenu de l'élément HTML ul
    ul.innerHTML = "";
    // Ajouter tous les éléments du tableau todosNode à l'élément HTML ul
    ul.append(...todosNode);
};

/**
 * CRÉATION D'UN ÉLÉMENT TODO
 */
// Définir une fonction createTodoElement qui prend en paramètre un objet todo et son index index dans le tableau todos
const createTodoElement = (todo, index) => {
    // Créer un élément HTML li
    const li = document.createElement("li");

    // Créer deux éléments HTML button pour supprimer et éditer la tâche
    const buttonDelete = document.createElement("button");
    const buttonEdit = document.createElement("button");
    // Assigner du texte aux boutons
    buttonDelete.innerText = "Supprimer";
    buttonEdit.innerText = "Éditer";
    // Assigner une classe CSS aux boutons
    buttonDelete.className = "danger";
    buttonEdit.className = "primary";
    // Ajouter des écouteurs d'événement click sur les boutons qui appellent les fonctions deleTodo et toggleEditMode
    buttonDelete.addEventListener("click", (event) => {
        // Empêcher le comportement par défaut du bouton (qui est de soumettre le formulaire) et la propagation de l'événement aux éléments parents
        event.preventDefault();
        event.stopPropagation();
        // Appeler la fonction deleTodo en lui passant l'index de la tâche à supprimer
        deleTodo(index);
    });
    buttonEdit.addEventListener("click", (event) => {
        // Empêcher le comportement par défaut du bouton (qui est de soumettre le formulaire) et la propagation de l'événement aux éléments parents
        event.preventDefault();
        event.stopPropagation();
        // Appeler la fonction toggleEditMode en lui passant l'index de la tâche à éditer
        toggleEditMode(index);
    });

    // Assigner du code HTML à l'élément HTML li
    li.innerHTML = `
        <span class="todo ${todo.done ? "done" : ""}"></span>
        <p class="${todo.done ? "done" : ""}">${todo.text}</p>
    `;
    // Utiliser des littéraux de gabarit pour insérer des expressions JavaScript entre des accolades
    // Utiliser la syntaxe ${todo.done ? "done" : ""} pour insérer la classe CSS done si la propriété done de l'objet todo est vraie, ou une chaîne vide sinon
    // Utiliser la syntaxe ${todo.text} pour insérer le texte de la tâche
    // Créer un élément HTML span avec la classe CSS todo qui représente une case à cocher, et un élément HTML p qui contient le texte de la tâche

    // Ajouter les deux boutons à l'élément HTML li
    li.append(buttonEdit, buttonDelete);
    // Ajouter un écouteur d'événement click sur l'élément HTML li qui appelle une fonction anonyme lorsque l'élément est cliqué
    li.addEventListener("click", (event) => {
        // Empêcher le comportement par défaut de l'élément (qui est de suivre un lien)
        event.preventDefault();
        // Utiliser la propriété detail de l'objet event qui contient le nombre de clics consécutifs sur l'élément
        // Si c'est le premier clic, lancer un timer qui appelle la fonction toggleTodo au bout de 200 millisecondes
        // Si c'est le second clic ou plus, annuler le timer et appeler la fonction toggleEditMode
        // Ainsi, implémenter une logique de double-clic
        if (event.detail === 1) {
            timer = setTimeout(() => {
                toggleTodo(index);
            }, 200);
        } else if (event.detail > 1) {
            clearTimeout(timer);
            toggleEditMode(index);
        }
    });
    // Renvoyer l'élément HTML li créé
    return li;
};

/**
 * CRÉATION D'UN ÉLÉMENT TODO EN MODE ÉDITION
 */
// Définir une fonction createTodoEditElement qui prend en paramètre un objet todo et son index index dans le tableau todos
const createTodoEditElement = (todo, index) => {
    // Créer un élément HTML li
    const li = document.createElement("li");
    // Créer un élément HTML input de type text qui contient le texte de la tâche à éditer
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = todo.text;

    // Créer un élément HTML button pour enregistrer la modification
    const buttonSave = document.createElement("button");
    // Assigner du texte et une classe CSS au bouton
    buttonSave.innerText = "Enregistrer";
    buttonSave.className = "success";
    // Ajouter un écouteur d'événement click sur le bouton qui appelle la fonction editTodo
    buttonSave.addEventListener("click", (event) => {
        // Empêcher le comportement par défaut du bouton (qui est de soumettre le formulaire) et la propagation de l'événement aux éléments parents
        event.preventDefault();
        event.stopPropagation();
        // Appeler la fonction editTodo en lui passant l'index de la tâche à modifier et l'élément HTML input
        editTodo(index, editInput);
        // Lancer une fonction asynchrone pour focus le champ input principal après sont ajout dans le dom par la fonction displayTodo()
        setTimeout(() => {
            input.focus();
        }, 200);
    });
    // Renvoyer l'élément HTML li créé
    return li;
};

/**
 * AJOUT D'UNE TODO EN EMPÊCHANT L'ENTRÉE D'UNE CHAÎNE VIDE
 */
// Définir une fonction addTodo qui prend en paramètre une chaîne de caractères text représentant le texte de la nouvelle tâche à ajouter
const addTodo = (text) => {
    // Supprimer les espaces vides avant et après la chaîne de caractères en utilisant la méthode trim()
    text = text.trim();
    // Vérifier si la chaîne de caractères n'est pas vide
    if (text) {
        // Ajouter un nouvel objet dans le tableau todos avec le texte passé en paramètre, la propriété done à false et la propriété editMode à false
        todos.push({
            text: `${text[0].toUpperCase()}${text.slice(1)}`,
            // Utiliser des littéraux de gabarit pour insérer des expressions JavaScript entre des accolades
            // Utiliser la syntaxe ${text[0].toUpperCase()} pour insérer le premier caractère de la chaîne de caractères en majuscule en utilisant la méthode toUpperCase()
            // Utiliser la syntaxe ${text.slice(1)} pour insérer le reste de la chaîne de caractères à partir de l'index 1 en utilisant la méthode slice()
            done: false,
            editMode: false,
        });
    }

    // Appeler la fonction displayTodo pour afficher la liste des tâches à l'écran
    displayTodo();
};

/**
 * SUPPRESSION D'UNE TODO
 */
// Définir une fonction deleTodo qui prend en paramètre un nombre index représentant l'index de la tâche à supprimer dans le tableau todos
const deleTodo = (index) => {
    // Supprimer un élément du tableau todos à l'index passé en paramètre en utilisant la méthode splice()
    todos.splice(index, 1);
    // Appeler la fonction displayTodo pour afficher la liste des tâches à l'écran
    displayTodo();
};

/**
 * CHANGEMENT DE STATUS D'UN TODO
 */
// Définir une fonction toggleTodo qui prend en paramètre un nombre index représentant l'index de la tâche à basculer entre terminée et non terminée dans le tableau todos
const toggleTodo = (index) => {
    // Modifier la propriété done de l'objet todo à l'index passé en paramètre en utilisant l'opérateur de négation !
    todos[index].done = !todos[index].done;
    // Appeler la fonction displayTodo pour afficher la liste des tâches à l'écran
    displayTodo();
};

/**
 * PASSAGE D'UNE TODO EN MODE ÉDITION
 */
// Définir une fonction toggleEditMode qui prend en paramètre un nombre index représentant l'index de la tâche à passer en mode édition dans le tableau todos
const toggleEditMode = (index) => {
    // Modifier la propriété editMode de l'objet todo à l'index passé en paramètre en utilisant l'opérateur de négation !
    todos[index].editMode = !todos[index].editMode;
    // Appeler la fonction displayTodo pour afficher la liste des tâches à l'écran
    displayTodo();
};

/**
 // MODIFICATION DU TEXTE D'UNE TODO EN MODE EDITION
 */
// Définir une fonction editTodo qui prend en paramètre un nombre index représentant l'index de la tâche à modifier dans le tableau todos, et un élément HTML input qui contient le texte modifié de la tâche
const editTodo = (index, input) => {
    // Récupérer la valeur de l'élément HTML input
    const value = input.value;
    // Modifier la propriété text de l'objet todo à l'index passé en paramètre avec la valeur de l'élément HTML input
    todos[index].text = value;
    // Modifier la propriété editMode de l'objet todo à l'index passé en paramètre à false
    todos[index].editMode = false;
    // Appeler la fonction displayTodo pour afficher la liste des tâches à l'écran
    displayTodo();
};

// Appeler la fonction displayTodo pour afficher la liste des tâches à l'écran au chargement du script
displayTodo();
