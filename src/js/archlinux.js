let isSpanish = false;
const originalTexts = new Map();
let originalContent;

document.addEventListener("DOMContentLoaded", () => {
  const contentContainer = document.getElementById("main-content");
  originalContent = contentContainer.innerHTML;
  const translateButton = document.getElementById("translateBtn");
  if (!translateButton) {
    return;
  }

  // Guardar los textos originales
  document
    .querySelectorAll(".translatable p, .title p, .list-index p")
    .forEach((element) => {
      originalTexts.set(element, element.innerHTML);
    });

  translateButton.addEventListener("click", toggleLanguage);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      restoreOriginalContent();
    }
  });

  assignEventListeners();
});

function toggleLanguage() {
  isSpanish = !isSpanish;
  const translateButton = document.getElementById("translateBtn");

  if (isSpanish) {
    translateContent();
    translateButton.innerHTML = `<span class="text-orange" style="cursor: pointer;">"EN"</span>`;
  } else {
    restoreOriginalContent();
    translateButton.innerHTML = `<span class="text-orange" style="cursor: pointer;">"ES"</span>`;
  }
}

function translateContent() {
  const mainContainer = document.getElementById("main-container");
  translateElement(mainContainer);

  // Actualizar el contenido dinámico si está cargado
  const currentContent = document.querySelector(".container-content");
  if (currentContent) {
    const type = currentContent.getAttribute("data-content-type");
    const id = currentContent.getAttribute("data-content-id");
    if (type && id) {
      updateContent(type, id);
    }
  }
}

function translateElement(element) {
  if (element.nodeType === Node.TEXT_NODE) {
    element.nodeValue = translateToSpanish(element.nodeValue);
  } else if (element.nodeType === Node.ELEMENT_NODE) {
    for (let child of element.childNodes) {
      translateElement(child);
    }
    if (element.hasAttribute("placeholder")) {
      element.setAttribute(
        "placeholder",
        translateToSpanish(element.getAttribute("placeholder"))
      );
    }
  }
}

function restoreOriginalContent() {
  const contentContainer = document.getElementById("main-content");
  contentContainer.innerHTML = originalContent;
  contentContainer.classList.remove("hidden");
  isSpanish = false;
  const translateButton = document.getElementById("translateBtn");
  translateButton.innerHTML = `<span class="text-orange" style="cursor: pointer;">"ES"</span>`;
  assignEventListeners(); // Reasignar los event listeners después de restaurar el contenido
}

function translateToSpanish(text) {
  const translations = {
    Home: "Inicio",
    Experience: "Experiencia",
    Projects: "Proyectos",
    "Skills - Tools": "Habilidades - Herramientas",
    of: "de",
    "Hi, I'm": "Hola, soy",
    "A Front-end developer.": "Un desarrollador Front-end.",
    "Another great passion": "Otra gran pasión",
    "mine is back-end development, where I like to learn about designing and optimizing server-side logic that supports those front-end features.":
      "lo que me gusta es el desarrollo back-end, donde me gusta aprender sobre el diseño y la optimización de la lógica del servidor que soporta esas características del front-end.",
    "I'm a passionate developer, always looking for new challenges and opportunities to learn.":
      "Soy un desarrollador apasionado, siempre buscando nuevos desafíos y oportunidades para aprender.",
    "Nowadays, you can find me on": "Actualmente, puedes encontrarme en",
    "You can always check out my work on": "Siempre puedes ver mi trabajo en",
    "You can find my resumé over here =>":
      "Puedes encontrar mi currículum aquí =>",
    resumé: "currículum",
    Press: "Presiona",
    "to return to main section": "para volver a la sección principal",
    Click: "Haz clic en",
    "if you want translate all content":
      "si quieres traducir todo el contenido",
  };

  Object.keys(translations).forEach((key) => {
    const regex = new RegExp(key, "gi");
    text = text.replace(regex, translations[key]);
  });

  return text;
}

async function updateContent(type, id) {
  console.log(`Actualizando contenido: ${type}, ${id}`);
  const contentInfo = isSpanish ? contentInfoES : contentInfoEN;
  if (contentInfo[type] && contentInfo[type][id]) {
    try {
      const content = await loadContent(contentInfo[type][id]);
      const contentContainer = document.getElementById("main-content");
      if (contentContainer) {
        contentContainer.innerHTML = content;
        const newContainer =
          contentContainer.querySelector(".container-content");
        if (newContainer) {
          newContainer.setAttribute("data-content-type", type);
          newContainer.setAttribute("data-content-id", id);
        }
        console.log(`Contenido actualizado: ${type}, ${id}`);
        if (isSpanish) {
          const elementsToTranslate = contentContainer.querySelectorAll();
          elementsToTranslate.forEach((element) => {
            element.innerHTML = translateToSpanish(element.innerHTML);
          });
        }
      } else {
        console.error("Contenedor de contenido no encontrado");
      }
    } catch (error) {
      console.error(`Error al cargar el contenido: ${error}`);
    }
  } else {
    console.warn(`URL no encontrada para tipo: ${type}, id: ${id}`);
  }
}

async function loadContent(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.text();
}

function assignEventListeners() {
  assignListeners("#experience", "experience-id", 1, 1);
  assignListeners("#projects", "project-id", 5, 5);
  assignListeners("#skills", "skills-id", 6, 6);
}

function assignListeners(selector, idAttribute, totalItems, resetOthers) {
  document
    .querySelectorAll(`${selector} .ui-list > div`)
    .forEach((item, index) => {
      item.addEventListener("click", async () => {
        const id = item.getAttribute(idAttribute);
        if (id) {
          await updateContent(selector.slice(1), id);
          updateIndices(selector, index + 1, totalItems, resetOthers);
        } else {
          console.warn(`Atributo ${idAttribute} no encontrado en:`, item);
        }
      });
    });
}

function updateIndices(currentSelector, currentIndex, totalItems, resetOthers) {
  const selectors = ["#experience", "#projects", "#skills"];
  selectors.forEach((selector) => {
    const listIndex = document.querySelector(`${selector} .list-index p`);
    if (selector === currentSelector) {
      listIndex.textContent = `${currentIndex} of ${totalItems}`;
    } else if (resetOthers) {
      listIndex.textContent = `1 of ${resetOthers}`;
    }
  });
}

const contentInfoEN = {
  experience: { experience1: "src/data/experience/experience1.html" },
  projects: {
    project1: "src/data/project/project1.html",
    project2: "src/data/project/project2.html",
    project3: "src/data/project/project3.html",
    project4: "src/data/project/project4.html",
    project5: "src/data/project/project5.html",
  },
  skills: {
    skills1: "src/data/skills-tools/html.html",
    skills2: "src/data/skills-tools/css.html",
    skills3: "src/data/skills-tools/javascript.html",
    skills4: "src/data/skills-tools/php.html",
    skills5: "src/data/skills-tools/python.html",
    skills6: "src/data/skills-tools/react.html",
  },
};

const contentInfoES = {
  experience: { experience1: "src/data_ES/experiencia/experiencia1.html" },
  projects: {
    project1: "src/data_ES/proyectos/proyecto1.html",
    project2: "src/data_ES/proyectos/proyecto2.html",
    project3: "src/data_ES/proyectos/proyecto3.html",
    project4: "src/data_ES/proyectos/proyecto4.html",
    project5: "src/data_ES/proyectos/proyecto5.html",
  },
  skills: {
    skills1: "src/data_ES/habilidades/html.html",
    skills2: "src/data_ES/habilidades/css.html",
    skills3: "src/data_ES/habilidades/javascript.html",
    skills4: "src/data_ES/habilidades/php.html",
    skills5: "src/data_ES/habilidades/python.html",
    skills6: "src/data_ES/habilidades/react.html",
  },
};
