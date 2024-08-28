export default async function getBooks(url, maxResults, category, search = "") {
	try {
		console.log(url);
		const apiURL = search ? `${url}&intitle=${search}` : url;
		console.log(category, apiURL);
		const response = await fetch(apiURL);
		// const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch books for ${category}`);
		}
		const data = await response.json();
		const books = data.items || [];
		return getCardDeck(books, category, maxResults);
	} catch (err) {
		return console.error(err);
	}
}

function createBookCard(item) {
	const { volumeInfo, saleInfo } = item;
	const thumbnail = volumeInfo.imageLinks?.smallThumbnail;
	const title = volumeInfo.title;
	const amount = saleInfo.listPrice?.amount;
	const publisher = volumeInfo.publisher;
	const authors = volumeInfo.authors;
	const previewLink = volumeInfo.previewLink;
	const publishedDate = volumeInfo.publishedDate;
	const description = volumeInfo.description;

	if (thumbnail !== undefined && amount !== undefined) {
		const bookCard = document.createElement("div");
		bookCard.id = item.id;
		bookCard.className = "book-card";
		bookCard.setAttribute("data-bs-toggle", "modal");
		bookCard.setAttribute("data-bs-target", "#bookModal");
		bookCard.innerHTML = `
        <img src='${thumbnail}' alt="book-image" class="img img-fluid" />
        <div class="book-details">
          <h5 class="title text-truncate" title="${title}" style="cursor:default;">${title}</h5>
          <p class="amount">₹${amount}</p>
        </div>
      `;
		bookCard.addEventListener("click", () => {
			document.getElementById("bookContent").innerHTML = `
      <div class="book-data">
        <div class="book-img">
          <img id="bookImage" src="${thumbnail}" alt="image-thumbnail" class="img" />
        </div>
		    <div class="data">
		      <h2 id="bookTitle" class="modal-title">${title}</h2>
		      <h3 class="book-amount">₹${amount}</h3>
          <h3 class="author-name">${authors}</h3>
          <h3 class="publisher">${publisher} | <span class="published-date">${publishedDate}</span></h3>
          <a id="previewLink" href="${previewLink}" target="_blank" class="btn btn-sm text-white btn-info">Read More</a>
        </div>
      </div> <hr/>
      <p class="description lead">${description}</p>
      `;
		});

		return bookCard;
	}
}

function getCardDeck(books, category, maxResults) {
	const validBooks = books.filter((item) => {
		const thumbnail = item.volumeInfo.imageLinks?.smallThumbnail;
		const amount = item.saleInfo.listPrice?.amount;
		return thumbnail !== undefined && amount !== undefined;
	});

	const slicedBooks = validBooks.slice(
		0,
		Math.min(maxResults, validBooks.length)
	);

	const cardDeck = document.createElement("div");
	cardDeck.id = `${category}Cards`;
	cardDeck.className = `${category} card-deck`;

	slicedBooks.forEach((item) => {
		const card = createBookCard(item);
		if (card) {
			cardDeck.appendChild(card);
		}
	});

	return cardDeck;
}
