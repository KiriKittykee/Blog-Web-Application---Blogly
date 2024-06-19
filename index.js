import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let recipes = [];
let creativeIdeas = [];
let randomThoughts = [];
let journalEntrys = [];
let title = '';
let idea ='';

function writeThatListForMommy(thingys,variableName) {
    let html = '';
    if(thingys) {
        if(thingys.length > 0) {
            html = `<ul style="list-style-type: circle;"> `;
            thingys.forEach((thingy, index) => {
                if(thingy.title) {
                    html += 
                    `<li id="${variableName}_${thingys.indexOf(thingy)}" class="titleIdea"> 
                        ${thingy.title}
                        <ul style="list-style-type: square;">
                            <li class="ideaIdea">${(thingy.idea)}</li>
                            <a href="/edit-post/${variableName}/${index}"><button class="edit formButton">Edit</button></a>
                            <a href="/delete-post/${variableName}/${index}"><button class="delete formButton" id="${variableName}_${thingys.indexOf(thingy)}">Delete</button></a>
                        </ul>
                    </li>` ;
                }else {
                    html += `<li id="${variableName}_${thingys.indexOf(thingy)}" class= "titleIdea"> This ${variableName} has no name. 
                                <ul style="list-style-type: square;">
                                    <li class= "ideaIdea"> ${(thingy.idea)} </li>
                                    <a href="/edit-post/${variableName}/${index}"><button class="edit formButton">Edit</button></a>
                                    <a href="/delete-post/${variableName}/${index}"><button class="delete formButton" id="${variableName}_${thingys.indexOf(thingy)}">Delete</button></a>
                                </ul>
                            </li>`;
                };
            }); 
            html += `</ul>`;
        };
    } else {
        html += ``;
    };
    return html;
};

function pushToArray(ideas, title, idea) {
    ideas.push({
        title: title,
        idea: idea
    });
}

app.get("/", (req,res) => {
    res.render("index.ejs");
});

app.get("/cooking-recipe", (req,res) => {
    res.render("recipe.ejs");
});

app.get("/creative-idea", (req,res) => {
    res.render("idea.ejs");
});

app.get("/random-thought", (req,res) => {
    res.render("randomthought.ejs");
});

app.get("/journal", (req,res) => {
    res.render("journal.ejs");
});

app.post("/submit-recipe", (req, res) => {
    title = req.body.title;
    idea = req.body.idea;
    pushToArray(recipes, title, idea);
    res.redirect("/homepage");
});

app.post("/submit-idea", (req, res) => {
    title = req.body.title;
    idea = req.body.idea;
    pushToArray(creativeIdeas, title, idea);
    res.redirect("/homepage");
});

app.post("/submit-thought", (req, res) => {
    title = req.body.title;
    idea = req.body.idea;
    pushToArray(randomThoughts, title, idea);
    res.redirect("/homepage");
})

app.post("/submit-journal", (req, res) => {
    title = req.body.title;
    idea = req.body.idea;
    pushToArray(journalEntrys, title, idea);
    res.redirect("/homepage");
})

app.get("/homepage", (req, res) => {
    res.render("index.ejs", {
        writeThatListForMommy: writeThatListForMommy,
        recipes: recipes,
        creativeIdeas: creativeIdeas,
        randomThoughts: randomThoughts,
        journalEntrys: journalEntrys,
    });
})

app.get('/edit-post/:type/:id', (req,res) => {
    const { id, type } = req.params;
    let post;
    switch (type) {
        case 'recipe':
            post = recipes[id];
            break;
        case 'idea':
            post = creativeIdeas[id];
            break;
        case 'thought':
            post = randomThoughts[id];
            break;
        case 'entry':
            post = journalEntrys[id];
            break;
        default:
            break;
    }
    console.log(type);
    console.log(post);
    res.render("editing.ejs", { post, type, id });
})


app.post("/update-post/:type/:id", (req, res) => {
    const { type, id } = req.params;
    const {title, idea } = req.body;
    switch(type) {
        case 'recipe':
            recipes[id].title = title;
            recipes[id].idea = idea;
            break;
        case 'idea':
            creativeIdeas[id].title = title;
            creativeIdeas[id].idea = idea;
            break;
        case 'thought':
            randomThoughts[id].title = title;
            randomThoughts[id].idea = idea;
            break;
        case 'entry':
            journalEntrys[id].title = title;
            journalEntrys[id].idea = idea;
            break;
        default:
            break;
    }
    res.redirect("/homepage");
});

app.get("/delete-post/:type/:id", (req, res) => {
    const { id, type } = req.params;
    let post;
    switch (type) {
        case 'recipe':
            post = recipes;
            break;
        case 'idea':
            post = creativeIdeas;
            break;
        case 'thought':
            post = randomThoughts;
            break;
        case 'entry':
            post = journalEntrys;
            break;
        default:
            break;
    }
    res.render("deleting.ejs", {post: post[id], type: type, id: id});
})

app.post("/delete-post/:type/:id", (req, res) => {
    const {id, type} = req.params;
    let postArray;
    switch(type) {
        case 'recipe':
            postArray = recipes;
            break;
        case 'idea':
            postArray = creativeIdeas;
            break;
        case 'thought':
            postArray = randomThoughts;
            break;
        case 'entry':
            postArray = journalEntrys;
            break;
        default:
            break;
    }
    const postId = parseInt(id);
    
    if (!isNaN(postId) && postId >= 0 && postId < postArray.length) {
        let newPostArray = postArray.splice(postId, 1);
        res.redirect("/homepage",);
    } else {
        res.status(404).send(`The ${type} with ID ${id} not found.`);
    }
})

app.get("/no-changes-made",(req, res) => {
    res.redirect("/homepage");
})

app.listen(port, () => {
    console.log(`The server is running on port ${port}.`);
});
