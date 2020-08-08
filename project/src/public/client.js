
const store = Immutable.Map({
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    photos: Immutable.List([]),
    show:'',
});

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    const newStore = store.merge(newState);
    // console.log(newStore)
    render(root, newStore)
};

const render = async (root, state) => {
    root.innerHTML = App(state)
};

// create content
const App = (state) => {

    const rovers = state.get('rovers');

    return `
        <header></header>
        <main class="container">
            <h1>Welcome!</h1>
            <section class="section">
                <div class="row">
                    <div class="col s12">
                    <ul class="tabs">
                        ${tabComponent(state.get('show'), rovers.get(0))}
                        ${tabComponent(state.get('show'), rovers.get(1))}
                        ${tabComponent(state.get('show'), rovers.get(2))}
                    </ul>
                    </div>
                    <div class="col s12">${renderContent(state.get('show'), state)}</div>
                </div>
            </section>
        </main>
        <footer></footer>
    `;
};

// saving the rover currently showing
const saveContent = (show) => {
    updateStore(store, {show});
};

// render the rover content
const renderContent = (content, state) => {

    const photos = state.get('photos');

    switch(content){
        case 'Curiosity':
            if(photos.get(0) === undefined){
                getRoverImages(content.toLowerCase(), state)
                return loadingComponenet();
            }  
            return roverContent(photos);

        case 'Opportunity':
            if(photos.get(0) === undefined){
                getRoverImages(content.toLowerCase(), state)
                return loadingComponenet();
            } 
            return roverContent(photos);

        case 'Spirit':
            if(photos.get(0) === undefined){
                getRoverImages(content.toLowerCase(), state)
                return loadingComponenet();
            }
            return roverContent(photos);

        default:
            return `
            <div class="divider"></div>
            <h5>Please select a rover to display information.</h5>
            `
    };
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS
const tabComponent = (showState, rover) => {
    return `<li class="tab col s4">
                <a onclick="${showState !== rover?`saveContent('${rover}')`:''}" href="#${rover}">
                    ${rover}
                </a>
            </li>`;
};

const loadingComponenet = () => {
    return `<div class="divider"></div>
            <h5>Loading...</h5>`;
};

const roverContent = (photos) => {
    const roverInfo = photos.get(0).get('rover');
    const jsPhotos = photos.toJS();
    
    return(`
            <div class="divider"></div>
            <div class="section">
                <h5>${roverInfo.get('name')}</h5>
                <p>Launch date: ${roverInfo.get('launch_date')}</p>
                <p>Landing date: ${roverInfo.get('landing_date')}</p>
                <p>Status: ${roverInfo.get('status')}</p>
            </div>
            <div class="divider"></div>
            <div class="section">
                <h5>Recent Photos</h5>
                <div class="row">
                ${jsPhotos.map((photo) => {
                    return(
                    `<div class="col s4">
                        <img class="responsive-img" src="${photo.img_src}" height="100%" width="100%" />
                    </div>`)
                }).join('')}
                </div>
            </div>
        `);
};

// ------------------------------------------------------  API CALLS
const getRoverImages = (rover, state) => {

    fetch(`http://localhost:3000/rovers`, {
        method:'POST', 
        body: JSON.stringify({rover: rover}), 
        headers: { 
        "Content-type": "application/json; charset=UTF-8"
        } 
        
    })
        .then(res => res.json())
        .then(res => {
            const photos = res.images;
            // console.log(res.images)
            updateStore(state, photos);
        })
};
