export type Theme = "dark" | "light";

const STORAGE_KEY = "algowiz-theme";

export const getStoredTheme = (): Theme => {
    try {
        return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
    } catch {
        return "dark";
    }
};

export const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        void 0;
    }
};

export const initTheme = () => {
    applyTheme(getStoredTheme());
};
