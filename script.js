const api = "https://api.github.com/users/";

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const lightenColor = (color, percent) => {
    const num = parseInt(color.slice(1), 16); // Convert HEX to Integer
    const amt = Math.round(2.55 * percent); // Calculate adjustment amount
    const R = (num >> 16) + amt; // Adjust red
    const G = ((num >> 8) & 0x00FF) + amt; // Adjust green
    const B = (num & 0x0000FF) + amt; // Adjust blue
    return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
        .toString(16)
        .slice(1)}`; // Convert back to HEX
};

const userGetFunction = (name) => {
    axios.get(api + name)
        .then((response) => {
            userCard(response.data);
            repoGetFunction(name);
        })
        .catch((err) => {
            if (err.response && err.response.status === 404) {
                errorFunction("No profile with this username");
            }
        });
};

const repoGetFunction = (name) => {
    axios.get(api + name + "/repos?sort=created")
        .then((response) => {
            repoCardFunction(response.data);
        })
        .catch(() => {
            errorFunction("Problem fetching repos");
        });
};

const userCard = (user) => {
    const id = user.name || user.login;
    const info = user.bio ? `<p>${user.bio}</p>` : "";
    const cardElement = `
        <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${id}</h2>
                ${info}
                <ul>
                    <li>${user.followers} <strong>Followers</strong></li>
                    <li>${user.following} <strong>Following</strong></li>
                    <li>${user.public_repos} <strong>Repos</strong></li>
                </ul>
                <div id="repos"></div>
            </div>
        </div>`;
    document.getElementById("main").innerHTML = cardElement;
};

const repoCardFunction = (repos) => {
    const reposElement = document.getElementById("repos");

    const randomColor = getRandomColor(); // Get a random base color
    const lightColor = lightenColor(randomColor, 40); // Generate a lighter version

    // Set site background to lightened random color
    document.body.style.backgroundColor = lightColor;

    repos.slice(0, 5).forEach((repo) => {
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;

        // Apply styles
        repoEl.style.color = "black"; // Font color black
        repoEl.style.backgroundColor = "white"; // White background
        repoEl.style.border = `2px solid ${randomColor}`; // Random border color
        reposElement.appendChild(repoEl);
    });
};

const errorFunction = (error) => {
    const cardHTML = `
        <div class="card">
            <h1>${error}</h1>
        </div>`;
    document.getElementById("main").innerHTML = cardHTML;
};

document.getElementById("userInput").addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("inputBox").value.trim();
    if (user) {
        userGetFunction(user);
        document.getElementById("inputBox").value = "";
    }
});
