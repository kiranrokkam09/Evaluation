const postContainer = document.getElementById("post-container");
let currentPage = 1;
let loading = false;

function fetchPosts(page) {
  return fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`)
    .then(response => response.json());
}

function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className = "post";
  postElement.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
  return postElement;
}

function loadMorePosts() {
  if (loading) return;
  loading = true;

  fetchPosts(currentPage)
    .then(posts => {
      for (const post of posts) {
        postContainer.appendChild(createPostElement(post));
      }
      currentPage++;
      loading = false;
    });
}

loadMorePosts(); // Initial load

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadMorePosts();
  }
});