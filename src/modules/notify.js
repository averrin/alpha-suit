import toast from 'svelte-french-toast';
import { get } from 'svelte/store';
import { theme } from "./stores.js"

const styles = {
  light: "",
  dark: 'border-radius: 1rem; background: #232323; color: #eee;',
}

export const notify = {
  component: (component, id) => {
    toast(component, {
      style: styles[get(theme)],
      duration: Infinity,
      id
    })
  },

  permanent: (text, id) => {
    toast(text, {
      style: styles[get(theme)],
      duration: Infinity,
      id
    })
  },

  info: (text, id) => {
    toast(text, {
      style: styles[get(theme)],
      id
    })
  },

  progress: (promise, settings) => {
    toast.promise(promise, settings, {
      style: styles[get(theme)],
    })
  }
};
