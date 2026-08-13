// ===========================
// Sidebar Navigation
// ===========================

function showSection(sectionId, element) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");

    document.querySelectorAll(".sidebar li").forEach(item => {
        item.classList.remove("active");
    });

    if (element) {
        element.classList.add("active");
    }

}


// ===========================
// Logout
// ===========================

function logout(){

    localStorage.removeItem("user_id");

    localStorage.removeItem("username");

    window.location.href="/login";

}

// ===========================
// Variables
// ===========================

const blogForm = document.getElementById("blogForm");

let editing = false;


// ===========================
// Add / Update Blog
// ===========================

blogForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const id = document.getElementById("blogId").value;

    const title = document.getElementById("title").value;

    const category = document.getElementById("category").value;

    const content = document.getElementById("content").value;

    let url = "/add-blog";
    let method = "POST";

    if (editing) {

        url = `/update-blog/${id}`;
        method = "PUT";

    }

    try {

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

           body: JSON.stringify({

    title,
    category,
    content,
    user_id: localStorage.getItem("user_id")

})

        });

        const message = await response.text();

        alert(message);

        blogForm.reset();

        editing = false;

        document.getElementById("publishBtn").innerText = "Publish Blog";

        loadBlogs();

    }

    catch (error) {

        console.log(error);

    }

});


// ===========================
// Load Blogs
// ===========================

async function loadBlogs() {

    try {

       const response = await fetch(

`/get-blogs/${localStorage.getItem("user_id")}`

);

        const blogs = await response.json();

        const table = document.getElementById("blogTable");

        table.innerHTML = "";

        blogs.forEach(blog => {

            table.innerHTML += `

            <tr>

                <td>${blog.blog_id}</td>

                <td>${blog.title}</td>

                <td>${blog.category_name}</td>

                <td>

                    <button onclick="editBlog(${blog.blog_id})">

                        Edit

                    </button>

                    <button onclick="deleteBlog(${blog.blog_id})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}


// ===========================
// Edit Blog
// ===========================

async function editBlog(id) {

    const response = await fetch(`/get-blog/${id}`);

    const blog = await response.json();

    document.getElementById("blogId").value = blog.blog_id;

    document.getElementById("title").value = blog.title;

    document.getElementById("category").value = blog.category_id;

    document.getElementById("content").value = blog.content;

    editing = true;

    document.getElementById("publishBtn").innerText = "Update Blog";

}


// ===========================
// Delete Blog
// ===========================

async function deleteBlog(id) {

    const confirmDelete = confirm("Are you sure you want to delete this blog?");

    if (!confirmDelete) return;

    try {

       const response = await fetch(

`/delete-blog/${id}/${localStorage.getItem("user_id")}`,

{

    method:"DELETE"

});
        const message = await response.text();

        alert(message);

        loadBlogs();

    }

    catch (error) {

        console.log(error);

    }

}

// ==========================
// CATEGORY CRUD
// ==========================

const categoryForm = document.getElementById("categoryForm");

let editingCategory = false;

categoryForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const id = document.getElementById("categoryId").value;

    const category_name = document.getElementById("categoryName").value;

    let url="/add-category";

    let method="POST";

    if(editingCategory){

        url=`/update-category/${id}`;

        method="PUT";

    }

    const response=await fetch(url,{

        method:method,

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            category_name
        })

    });

    alert(await response.text());

    categoryForm.reset();

    editingCategory=false;

    document.getElementById("categoryBtn").innerText="Add Category";

    loadCategories();

});

async function loadCategories(){

    const response=await fetch("/get-categories");

    const categories=await response.json();

    const table=document.getElementById("categoryTable");

    table.innerHTML="";

    categories.forEach(category=>{

        table.innerHTML+=`

        <tr>

            <td>${category.category_id}</td>

            <td>${category.category_name}</td>

            <td>

                <button onclick="editCategory(${category.category_id})">

                    Edit

                </button>

                <button onclick="deleteCategory(${category.category_id})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });
    loadBlogCategories();

}

async function editCategory(id){

    const response=await fetch(`/get-category/${id}`);

    const category=await response.json();

    document.getElementById("categoryId").value=category.category_id;

    document.getElementById("categoryName").value=category.category_name;

    editingCategory=true;

    document.getElementById("categoryBtn").innerText="Update Category";

}

async function deleteCategory(id){

    if(!confirm("Delete Category?")) return;

    const response=await fetch(`/delete-category/${id}`,{

        method:"DELETE"

    });

    alert(await response.text());

    loadCategories();
    

}

loadCategories();


// ===========================
// Initial Load
// ===========================

loadBlogs();
//Dashboard Stats// 

async function loadDashboard(){

    const response = await fetch("/dashboard-stats");

    const data = await response.json();

    document.getElementById("totalBlogs").innerText = data.blogs;

    document.getElementById("totalCategories").innerText = data.categories;

    document.getElementById("totalComments").innerText = data.comments;

    document.getElementById("totalLikes").innerText = data.likes;

}

loadDashboard();
// comments // 
async function loadComments(){

    const response = await fetch("/get-comments");

    const comments = await response.json();

    const table = document.getElementById("commentTable");

    table.innerHTML = "";

    comments.forEach(comment => {

        table.innerHTML += `

        <tr>

            <td>${comment.username}</td>

            <td>${comment.comment}</td>

            <td>

                <button onclick="deleteComment(${comment.comment_id})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}
//delete comment//
async function deleteComment(id){

    if(!confirm("Delete Comment?")) return;

    const response = await fetch(`/delete-comment/${id}`,{
        method:"DELETE"
    });

    alert(await response.text());

    loadComments();
    loadDashboard();

}
// Analytics//
async function loadAnalytics(){

    const response = await fetch(
    `/analytics/${localStorage.getItem("user_id")}`
);

    const data = await response.json();

    // Cards

    document.getElementById("totalBlogs").innerText=data.blogs;

    document.getElementById("totalCategories").innerText=data.categories;

    document.getElementById("totalComments").innerText=data.comments;

    document.getElementById("totalLikes").innerText=data.likes;

    document.getElementById("totalViews").innerText=data.views;

    document.getElementById("totalDislikes").innerText=0;

    // Graph Data

    const labels=data.categoryData.map(item=>item.category_name);

    const values=data.categoryData.map(item=>Number(item.total));

    new Chart(document.getElementById("categoryChart"),{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Blogs",

                data:values

            }]

        }

    });

    new Chart(document.getElementById("pieChart"),{

        type:"pie",

        data:{

            labels:labels,

            datasets:[{

                data:values

            }]

        }

    });

    // Top Blogs

    const table=document.getElementById("topBlogsTable");

    table.innerHTML="";

    data.topBlogs.forEach((blog,index)=>{

        table.innerHTML+=`

        <tr>

            <td>${index+1}</td>

            <td>${blog.title}</td>

            <td>${blog.views}</td>

            <td>${blog.likes}</td>

        </tr>

        `;

    });

}

loadAnalytics();
// Load Categories in drop down
async function loadBlogCategories() {

    try {

        const response = await fetch("/get-categories");

        const categories = await response.json();

        const categorySelect = document.getElementById("category");

        categorySelect.innerHTML = `
            <option value="">Select Category</option>
        `;

        categories.forEach(category => {

            categorySelect.innerHTML += `
                <option value="${category.category_id}">
                    ${category.category_name}
                </option>
            `;

        });

    }

    catch (error) {

        console.log("Error loading categories:", error);

    }

}

loadBlogCategories();