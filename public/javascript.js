var userInput = document.getElementById("username");
var userList = $("#usersList");

var userBody = $("#UserBody");
var userHeader = $("#UserNameHeader");
var toggleButton = $("#toggleButton");

toggleButton.on("click", () => {
    toggleHidden();
})

userInput.addEventListener("change", (data)=> {
    console.log(userInput.value)
    let username = userInput.value;

    fetch(`http://projectdol.herokuapp.com/api/user/${username}`).then(res => {
        location.reload();
    });
})

fetch("http://projectdol.herokuapp.com/api/users").then(res=> res.json()).then(
    data => {
        console.log(data);
        makeUserList(data);
    }

);


function makeUserList(users){
    console.log(users);
    users.forEach(user => {
        console.log(user);
        let userHtml = `<button id="${user._id}" class="button is-primary is-rounded">${user.username}</button>`;
        userList.append(userHtml);
        let userDiv = $(`#${user._id}`);
        userDiv.on("click", () => {
            toggleHidden("person");
            renderCardData(user);
        })
    })
}

function toggleHidden(personClick){
    var selector = $("#minjCard");

    if (personClick){
        if (selector.hasClass("is-hidden"))
            selector.removeClass("is-hidden");    
    } else  {
    if (selector.hasClass("is-hidden"))
        selector.removeClass("is-hidden");
    else
        selector.addClass("is-hidden")
    }
    
    
}

function renderCardData(user) {
    console.log("card data", user);
    let pString = `<p>losses: ${user.losses}</p>
    <p>wins: ${user.wins}</p>
    <p>rank: ${user.ranked}</p>`

    userBody.html(pString);
    userHeader.text(user.username);
}