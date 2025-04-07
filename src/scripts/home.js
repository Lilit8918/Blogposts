import UI from "./utils/ui.js";
import { api } from "./apis/api.js";
import { isUserLogin } from "./utils/is-user-login.js";
import { Storage } from "./utils/storage.js";

const isUserLogged = isUserLogin();

const createAuthButton = () => {
    const authButton = UI.createElement("a", { href: "./index.html", class: "btn" }, isUserLogged ? "Log Out" : "Log In");
    authButton.addEventListener("click", () => {
        if (isUserLogged) {
            Storage.clear();
        }
        window.location.assign("./index.html");
    });
    return authButton;
};
// Wait for the DOM to be ready before adding the button
document.addEventListener("DOMContentLoaded", () => {
    const chatbotBtn = document.createElement("a");
    chatbotBtn.href = "./chatbot.html";
    chatbotBtn.className = "btn";
    chatbotBtn.textContent = "Chatbot";

    // Use the correct container (for example, a div with class 'buttons')
    const container = document.querySelector(".buttons");  // Make sure the class matches

    if (container) {
        container.appendChild(chatbotBtn);  // Append the button to the container
    } else {
        console.error("Container not found!");
    }
});

const createHeaderSection = () => {
    const headerContent = UI.createElement("div", { class: "content" }, [
        UI.createElement("p", { class: "text" }, "Explore your postcards and connect with bloggers.")
    ]);

    const buttons = UI.createElement("div", { class: "buttons" }, [
        UI.createElement("a", { href: "./registration.html", class: "btn" }, "Sign Up"),
        createAuthButton()
    ]);

    return UI.createElement("header", { class: "header" }, [
        buttons,
        UI.createElement('h1', { class: 'heading' }, 'Welcome to Your Workspace'),
        headerContent
    ]);
};

const createBloggerProfileCard = (blogger) => {
    return UI.createElement("div", { class: "blogger-item", id: blogger.id }, [
        UI.createElement("img", {
            class: "avatar",
            src: blogger.avatar || "https://example.com/default-avatar.png",
            alt: "user"
        }),
        UI.createElement("div", { class: "blogger-name" }, `${blogger.firstName} ${blogger.lastName}`),
    ]);
};
;

const createSidebarNavbar = () => {
    const navbar = UI.createElement("div", { class: "sidebar" }, [
        UI.createElement("h2", { class: "_title" }, "Bloggers"),
        UI.createElement("ul", { id: "blogger-list", class: "bloggers-container" })
    ]);

    document.addEventListener("DOMContentLoaded", showAllBloggers);

    return navbar;
};

const createPostCardItem = (post) => {
    return UI.createElement("div", { class: "box post", id: `post-${post.id}`, "data-id": post.id }, [
        UI.createElement("div", { class: "post-header" }, [
            UI.createElement("h3", { class: "post-title" }, post.title),
            UI.createElement("p", { class: "author-name" }, post.authorName),
        ]),
        UI.createElement("div", { class: "post-description" }, [
            UI.createElement("img", { class: "post-image", src: post.img, alt: "post image" }),
            UI.createElement("p", { class: "post-text" }, post.story),
        ]),
        UI.createElement("div", { class: "post-buttons" }, [
            UI.createElement("button", { class: "like-btn", "data-id": post.id }, "👍 Like"),
            UI.createElement("button", { class: "dislike-btn", "data-id": post.id }, "👎 Dislike"),
            UI.createElement("button", { class: "edit-btn", "data-id": post.id }, "Edit"),
            UI.createElement("button", { class: "delete-btn", "data-id": post.id }, "Delete"),
        ]),
    ]);
};

// This function will be called to add like/dislike functionality to each post
const addLikeDislikeEventListeners = () => {
    const likeButtons = document.querySelectorAll('.like-btn');
    const dislikeButtons = document.querySelectorAll('.dislike-btn');

    likeButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const postId = e.target.getAttribute('data-id');
            alert(`Post ${postId} liked!`);  // Show alert when "Like" button is clicked
        });
    });

    dislikeButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const postId = e.target.getAttribute('data-id');
            alert(`Post ${postId} disliked!`);  // Show alert when "Dislike" button is clicked
        });
    });
};

// After creating the post cards, call the addLikeDislikeEventListeners to add functionality
const renderPosts = (posts) => {
    const postsContainer = document.getElementById('posts-container'); // Assuming you have this container in your HTML

    posts.forEach((post) => {
        const postCard = createPostCardItem(post);
        postsContainer.appendChild(postCard);
    });

    // Add event listeners after rendering posts
    addLikeDislikeEventListeners();
};

const createMainContentSection = () => {
    return UI.createElement("main", { class: "main-section" }, [
        createSidebarNavbar(),
        UI.createElement("div", { class: "box" }, [
            UI.createElement("div", { class: "header-with-btn" }, [
                UI.createElement("h2", { class: "_title" }, "Posts"),
                UI.createElement("button", { class: "create-Post-Btn", id: "createPostBtn" }, "Create Post")
            ]),
            UI.createElement("section", { class: "posts", id: "posts" }, displayPosts()),
            createFooterSection(),
        ]),
    ]);
};


const createFooterSection = () => {
    return UI.createElement("footer", { class: "footer" }, [
        UI.createElement("p", { class: "footer-text" }, "Made with ❤️ by Lilit"),
        UI.createElement("p", { class: "footer-date" }, `© 2014 - ${new Date().getFullYear()} All rights reserved`)
    ]);
};

const createLayout = () => {
    const container = UI.createElement("div", { class: "container-root" }, [
        createHeaderSection(),
        createMainContentSection(),
    ]);
    UI.render(container, document.body);

    document.getElementById("createPostBtn").addEventListener("click", () => {
        window.location.assign("./new-post.html");
    });
};

const displayPosts = async () => {
    try {
        const posts = await api.post.getPosts();
        const postsContainer = document.querySelector("#posts");
        posts.forEach(post => {
            postsContainer.prepend(createPostCardItem(post));
        });
    } catch (error) {
        console.error("Error retrieving data", error);
    }
};

const showAllBloggers = async () => {
    try {
        const users = await api.user.getUser();
        const bloggerList = document.querySelector("#blogger-list");

        if (!bloggerList) {
            console.error("Blogger list container not found.");
            return;
        }

        users.forEach(user => {
            const bloggerCard = createBloggerProfileCard(user);
            bloggerList.appendChild(bloggerCard);
        });
    } catch (error) {
        console.log("Error retrieving users:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.querySelector("#posts");

    if (!postsContainer) {
        console.error("The posts container is not available in the DOM.");
        return;
    }

    postsContainer.addEventListener("click", async (event) => {
        if (!isUserLogged) {
            window.location.assign("./index.html");
            return;
        }

        let postId = null;
        if (event.target.classList.contains("delete-btn")) {
            postId = event.target.closest(".post").dataset.id;
            try {
                await api.post.delete(postId);
                console.log("Post deleted successfully");
                event.target.closest(".post").remove();
            } catch (error) {
                console.error("Error deleting post", error);
            }
        }

        if (event.target.classList.contains("edit-btn")) {
            postId = event.target.closest(".post").dataset.id;
            const postUrl = `./new-post.html?postId=${postId}`;
            window.location.assign(postUrl);
        }
    });
});


createLayout();
