async function loadPost() {
    const postContent = document.getElementById("post-content");

    if (!postContent) return;

    const mdPath = window.location.pathname.replace(/\.html$/, ".md");

    try {
        const response = await fetch(mdPath);

        if (!response.ok) {
            throw new Error("Post could not be loaded.");
        }

        const markdown = await response.text();
        postContent.innerHTML = marked.parse(markdown);

        const heading = postContent.querySelector("h2");

        if (heading) {
            document.title = `${heading.textContent.trim()} | Manikandan Sambasivam`;
        }

        initStoryPage();
    } catch (error) {
        postContent.textContent = "Post could not be loaded.";
        console.error(error);
    }
}

loadPost();
