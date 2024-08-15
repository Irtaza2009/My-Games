const games = [
  {
    title: "Game 1",
    description: "An exciting adventure game.",
    thumbnail: "https://via.placeholder.com/300",
    link: "https://example.com/game1",
  },
  {
    title: "Game 2",
    description: "A thrilling puzzle game.",
    thumbnail: "https://via.placeholder.com/300",
    link: "https://example.com/game2",
  },
  {
    title: "Game 3",
    description: "A fun arcade game.",
    thumbnail: "https://via.placeholder.com/300",
    link: "https://example.com/game3",
  },
];

const container = document.getElementById("game-container");

games.forEach((game) => {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
        <a href="${game.link}">
            <img src="${game.thumbnail}" alt="${game.title}">
            <div class="card-content">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
            </div>
        </a>
    `;

  container.appendChild(card);
});
