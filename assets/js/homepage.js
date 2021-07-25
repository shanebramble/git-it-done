var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var lanquageButtonsEl = document.querySelector("div #language-buttons");

var getUserRepos = function (user) {
    // Format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // Make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: GitHub User Not Found");
            }

        })
        .catch(function (error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        });

};
var getFeaturedRepos = function (language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data.items, language);
            });
        } else {
            alert('Error: GitHub User Not Found');
        }
    });
};

var displayRepos = function (repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // When working with an app that displays data based on user input, we should 
    // always be sure to clear out the old content before displaying new content.
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container 
        repoEl.appendChild(titleEl);

        // Create a status element 
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if the current repo has issue or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        // append to container
        repoEl.appendChild(statusEl);


        // append container to the dom 
        repoContainerEl.appendChild(repoEl);
    }


}
var formSubmitHandler = function (event) {
    event.preventDefault();

    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a github username");
    }
};

var buttonClickHandler = function (event) {
    var language = event.target.getAttribute("data-language");
    if (language) {
        getFeaturedRepos(language);
        // Clear old content
        repoContainerEl.textContent = "";
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);
lanquageButtonsEl.addEventListener("click", buttonClickHandler);