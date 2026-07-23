let allBlogs = [];

// =======================
// LOAD BLOGS
// =======================

async function loadBlogs() {

    try {

        const response = await fetch("/user-blogs");

        allBlogs = await response.json();

        displayBlogs(allBlogs);

    }

    catch (error) {

        console.log(error);

    }

}

// =======================
// DISPLAY BLOGS
// =======================

function displayBlogs(blogs) {

    const container = document.getElementById("blogContainer");

    container.innerHTML = "";

    if (blogs.length === 0) {

        container.innerHTML = `

        <div class="blog-card">

            <h3>No Blogs Found 😔</h3>

            <p>Try another search.</p>

        </div>

        `;

        return;

    }

    blogs.forEach(blog => {

        container.innerHTML += `

        <div class="blog-card">

            <h3>${blog.title}</h3>

            <p>

                <b>Category:</b>

                <a href="#"
                onclick="loadCategoryBlogs('${blog.category_name}'); return false;">

                    ${blog.category_name}

                </a>

            </p>

            <p>

                ${blog.content.substring(0,120)}...

            </p>

            <button onclick="openBlog(${blog.blog_id})">

                Read More

            </button>

        </div>

        `;

    });

}

// =======================
// OPEN BLOG
// =======================

function openBlog(id){

    window.location.href=`/blog-page?id=${id}`;

}

// =======================
// LOAD CATEGORIES
// =======================

async function loadCategories(){

    try{

        const response = await fetch("/get-categories");

        const categories = await response.json();

        const list = document.getElementById("categoryList");

        list.innerHTML = "";

        list.innerHTML += `

        <li>

            <a href="#"

            onclick="loadBlogs(); return false;">

                All Blogs

            </a>

        </li>

        `;

        categories.forEach(category=>{

            list.innerHTML += `

            <li>

                <a href="#"

                onclick="loadCategoryBlogs('${category.category_name}'); return false;">

                    ${category.category_name}

                </a>

            </li>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

// =======================
// CATEGORY FILTER
// =======================

function loadCategoryBlogs(category){

    const filtered = allBlogs.filter(blog=>{

        return blog.category_name === category;

    });

    displayBlogs(filtered);

}

// =======================
// SEARCH
// =======================

document.getElementById("searchInput").addEventListener("keyup",function(){

    const keyword = this.value.toLowerCase().trim();

    const filtered = allBlogs.filter(blog=>{

        return(

            blog.title.toLowerCase().includes(keyword)

            ||

            blog.category_name.toLowerCase().includes(keyword)

            ||

            blog.content.toLowerCase().includes(keyword)

        );

    });

    displayBlogs(filtered);

});

// =======================
// INITIAL LOAD
// =======================

loadBlogs();

loadCategories();

// =======================
// USER LOGIN STATUS
// =======================

function checkUser(){

    const username = localStorage.getItem("username");

    if(username){

        document.getElementById("welcomeUser").style.display="block";

        document.getElementById("loginBtn").style.display="none";

        document.getElementById("signupBtn").style.display="none";

        document.getElementById("welcomeText").innerHTML=
        `<i class="fa-solid fa-circle-user"></i>
        ${username}
        <i class="fa-solid fa-chevron-down"></i>`;

    }

    else{

        document.getElementById("welcomeUser").style.display="none";

        document.getElementById("loginBtn").style.display="block";

        document.getElementById("signupBtn").style.display="block";

    }

}

// =======================
// LOGOUT
// =======================

function logout(){

    localStorage.removeItem("user_id");
    localStorage.removeItem("username");

    window.location.href="/";

}

// =======================

checkUser();

function toggleDropdown(event){

    event.preventDefault();

    const menu = document.querySelector(".dropdown-menu");

    menu.classList.toggle("show");

}

document.addEventListener("click", function(event){

    const dropdown = document.querySelector(".dropdown");

    if(!dropdown.contains(event.target)){

        document.querySelector(".dropdown-menu").classList.remove("show");

    }

});