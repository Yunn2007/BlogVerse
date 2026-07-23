// ======================
// Get Blog ID
// ======================

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

// ======================
// Load Blog
// ======================

async function loadBlog(){

    await fetch(`/increase-view/${id}`,{
        method:"PUT"
    });

    const response = await fetch(`/user-blog/${id}`);

    const blog = await response.json();

    document.getElementById("title").innerText = blog.title;

    document.getElementById("category").innerText = blog.category_name;

    document.getElementById("views").innerText = blog.views;

    document.getElementById("content").innerText = blog.content;

    // Load likes
    loadLikes();

}

loadBlog();


// ======================
// Load Likes
// ======================

async function loadLikes(){

    const response = await fetch(`/blog-likes/${id}`);

    const data = await response.json();

    document.getElementById("likeCount").innerText = data.count;

}


// ======================
// Like Blog
// ======================

async function likeBlog(){

    await fetch(`/like-blog/${id}`,{
        method:"POST"
    });

    loadLikes();

}
// ======================
// Load Comments
// ======================

async function loadComments(){

    const response = await fetch(`/comments/${id}`);

    const comments = await response.json();

    const container = document.getElementById("commentContainer");

    container.innerHTML = "";

    comments.forEach(comment => {

        container.innerHTML += `

        <div class="comment-box">

            <h4>${comment.user_name}</h4>

            <p>${comment.comment}</p>

            <small>${new Date(comment.created_at).toLocaleString()}</small>

            <hr>

        </div>

        `;

    });

}

loadComments();


// ======================
// Add Comment
// ======================

document.getElementById("commentForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const comment = document.getElementById("comment").value;

    const user_name = localStorage.getItem("username");
    if(!user_name){

    alert("Please login first.");

    window.location.href="/login";

    return;

}

    const response = await fetch("/add-comment",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            blog_id:id,

            user_name,

            comment

        })

    });

    alert(await response.text());

    document.getElementById("commentForm").reset();

    loadComments();

});