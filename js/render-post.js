async function loadPost() {
    const postContent = document.getElementById("post-content");
    const parameters = new URLSearchParams(window.location.search);
    const postName = parameters.get("name");

    if (!postName || !/^[a-zA-Z0-9-]+$/.test(postName)) {
        postContent.textContent = "Post not found.";
        return;
    }

    try {
        const response = await fetch(`blogs/${postName}.md`);

        if (!response.ok) {
            throw new Error("Post could not be loaded.");
        }

        const markdown = await response.text();
        postContent.innerHTML = marked.parse(markdown);

        const heading = postContent.querySelector("h1");

        if (heading) {
            document.title = `${heading.textContent} | T. R. Harikrishnan`;
        }
        if (window.MathJax) {
            await MathJax.startup.promise;
            await MathJax.typesetPromise([postContent]);
        }
    } catch (error) {
        postContent.textContent = "Post could not be loaded.";
        console.error(error);
    }
}

loadPost();