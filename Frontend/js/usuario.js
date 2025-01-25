import {ImageUpdater} from "../content/Image.js";

const DOM_ELEMENTS = {
    
}

const ROUTES = {
    getPerfil: "http://localhost:3000/perfiles",
}

function getPerfil() {
    fetch(ROUTES.getPerfil, {
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
}


// const imageUpdater = new ImageUpdater(
//     "https://codebyelaina.com/bucket/image/logo_aeis.png",
//     ".logo_aeis"
// );
// imageUpdater.updateImage();

getPerfil();

