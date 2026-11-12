const CLAVE = "proyectos_tema";

export type Tema = "light" | "dark";

export function temaGuardado(): Tema {
  return localStorage.getItem(CLAVE) === "dark" ? "dark" : "light";
}

export function pintarTema(tema: Tema) {
  document.documentElement.dataset.theme = tema;
  document.documentElement.style.colorScheme = tema;
}

export function aplicarTema(tema: Tema) {
  localStorage.setItem(CLAVE, tema);
  pintarTema(tema);
}

export function aplicarTemaGuardado() {
  pintarTema(temaGuardado());
}

export function alternarTema() {
  const actual = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  aplicarTema(actual === "dark" ? "light" : "dark");
}
