import axios from 'axios'
import Cookies from 'js-cookie'

export const inputChangeHandler = (event, stateHandler, localStorageKey) => {
    event.persist();
    stateHandler(prev => {
        const newState = {...prev, [event.target.name]: event.target.value};
        if (localStorageKey) {
            localStorage.setItem(localStorageKey, JSON.stringify(newState));
        }
        return newState;
    })
}

export function csrfAxios(url, data, config) {
   const csrfToken = Cookies.get('csrftoken');
   if (!config) {config = {}}
   return axios.post(url, data, {...config, headers: {...config.headers, 'X-CSRFToken': csrfToken}});
}

export function isLogged() {
    return Cookies.get('auth');
}


function _load(src, srcSet) {
    const image = new Image();
    image.src = src;
    image.srcset = srcSet;
}

export async function loadImage(src, srcSet) {
    const res = await _load(src, srcSet);
}

