const path = require("path");
const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3000;

// =======================
// Middleware
// =======================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// =======================
// GET Routes
// =======================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "Signup.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin.html"));
});


// =======================
// USER LOGIN
// =======================

app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    try{

        const result = await pool.query(

            `SELECT *
             FROM users
             WHERE username=$1
             AND password=$2`,

            [username,password]

        );

        if(result.rows.length>0){

            res.json({

                success:true,

                user_id:result.rows[0].user_id,

                username:result.rows[0].username

            });

        }

        else{

            res.json({

                success:false

            });

        }

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});
// =======================
// USER SIGNUP
// =======================

app.post("/signup", async (req, res) => {

    const { fullname, username, email, password } = req.body;

    try {

        await pool.query(

            `INSERT INTO users(fullname, username, email, password)
             VALUES($1,$2,$3,$4)`,

            [fullname, username, email, password]

        );

        res.send("Signup Successful");

    }

    catch(error){

        console.log(error);

        res.send("Username or Email Already Exists");

    }

});
app.post("/add-blog", async (req, res) => {

    const { title, category, content, user_id } = req.body;

    try {

        await pool.query(

            `INSERT INTO blogs
            (title, category_id, content, user_id)
            VALUES($1,$2,$3,$4)`,

            [title, category, content, user_id]

        );

        res.send("Blog Published Successfully");

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});


// =======================
// GET BLOGS
// =======================

app.get("/get-blogs/:user_id", async (req, res) => {

    const user_id = req.params.user_id;

    try {

        const result = await pool.query(

            `SELECT

                blogs.blog_id,

                blogs.title,

                categories.category_name

            FROM blogs

            JOIN categories
            ON blogs.category_id = categories.category_id

            WHERE blogs.user_id = $1

            ORDER BY blogs.blog_id DESC`,

            [user_id]

        );

        res.json(result.rows);

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});


// =======================
// DELETE BLOG
// =======================

app.delete("/delete-blog/:id/:user_id", async (req,res)=>{

    const id=req.params.id;

    const user_id=req.params.user_id;

    try{

        await pool.query(

            `DELETE
             FROM blogs
             WHERE blog_id=$1
             AND user_id=$2`,

            [id,user_id]

        );

        res.send("Blog Deleted Successfully");

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});

// =======================
// GET SINGLE BLOG
// =======================

app.get("/get-blog/:id", async (req, res) => {

    const id = req.params.id;

    try {

        const result = await pool.query(

            `SELECT * FROM blogs
             WHERE blog_id = $1`,

            [id]

        );

        res.json(result.rows[0]);

    } catch (error) {

        console.log(error);
        res.status(500).send("Database Error");

    }

});


// =======================
// UPDATE BLOG
// =======================

app.put("/update-blog/:id", async (req, res) => {

    const id = req.params.id;

    const { title, category, content, user_id } = req.body;

    try {

       await pool.query(

    `UPDATE blogs
     SET title=$1,
         category_id=$2,
         content=$3
     WHERE blog_id=$4
     AND user_id=$5`,

    [title, category, content, id, user_id]

);

        res.send("Blog Updated Successfully");

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});

// =======================
// ADD CATEGORY
// =======================

app.post("/add-category", async (req, res) => {

    const { category_name } = req.body;

    try {

        await pool.query(
            "INSERT INTO categories(category_name) VALUES($1)",
            [category_name]
        );

        res.send("Category Added Successfully");

    } catch (error) {

        console.log(error);
        res.status(500).send("Database Error");

    }

});


// =======================
// GET CATEGORIES
// =======================

app.get("/get-categories", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM categories ORDER BY category_id DESC"
        );

        res.json(result.rows);

    } catch (error) {

        console.log(error);
        res.status(500).send("Database Error");

    }

});


// =======================
// GET SINGLE CATEGORY
// =======================

app.get("/get-category/:id", async (req, res) => {

    const id = req.params.id;

    try {

        const result = await pool.query(
            "SELECT * FROM categories WHERE category_id = $1",
            [id]
        );

        res.json(result.rows[0]);

    } catch (error) {

        console.log(error);
        res.status(500).send("Database Error");

    }

});


// =======================
// UPDATE CATEGORY
// =======================

app.put("/update-category/:id", async (req, res) => {

    const id = req.params.id;
    const { category_name } = req.body;

    try {

        await pool.query(
            "UPDATE categories SET category_name=$1 WHERE category_id=$2",
            [category_name, id]
        );

        res.send("Category Updated Successfully");

    } catch (error) {

        console.log(error);
        res.status(500).send("Database Error");

    }

});


// =======================
// DELETE CATEGORY
// =======================

app.delete("/delete-category/:id", async (req, res) => {

    const id = req.params.id;

    try {

        await pool.query(
            "DELETE FROM categories WHERE category_id=$1",
            [id]
        );

        res.send("Category Deleted Successfully");

    } catch (error) {

        console.log(error);
        res.status(500).send("Database Error");

    }

});

// =======================
// DASHBOARD STATS
// =======================

app.get("/dashboard-stats", async (req, res) => {

    try {

        const blogs = await pool.query(
            "SELECT COUNT(*) FROM blogs"
        );

        const categories = await pool.query(
            "SELECT COUNT(*) FROM categories"
        );

        const comments = await pool.query(
            "SELECT COUNT(*) FROM comments"
        );

        const likes = await pool.query(
            "SELECT COUNT(*) FROM likes"
        );

        res.json({

            blogs: blogs.rows[0].count,
            categories: categories.rows[0].count,
            comments: comments.rows[0].count,
            likes: likes.rows[0].count

        });

    } catch (error) {

        console.log(error);

        res.status(500).send("Database Error");

    }

});

// =======================
// GET COMMENTS
// =======================

app.get("/get-comments", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM comments
            ORDER BY comment_id DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.log(error);
        res.status(500).send("Database Error");

    }

});

// =======================
// DELETE COMMENT
// =======================

app.delete("/delete-comment/:id", async (req, res) => {

    const id = req.params.id;

    try {

        await pool.query(
            "DELETE FROM comments WHERE comment_id = $1",
            [id]
        );

        res.send("Comment Deleted Successfully");

    } catch (error) {

        console.log(error);
        res.status(500).send("Database Error");

    }

});

// =======================
// ADD COMMENT
// =======================

app.post("/add-comment", async (req, res) => {

    const { blog_id, user_name, comment } = req.body;

    try {

        await pool.query(

            `INSERT INTO comments
            (blog_id,user_name,comment)
            VALUES($1,$2,$3)`,

            [blog_id, user_name, comment]

        );

        res.send("Comment Added Successfully");

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});

// =======================
// GET BLOG COMMENTS
// =======================

app.get("/comments/:blog_id", async (req,res)=>{

    const blog_id=req.params.blog_id;

    try{

        const result=await pool.query(

            `SELECT *

             FROM comments

             WHERE blog_id=$1

             ORDER BY created_at DESC`,

            [blog_id]

        );

        res.json(result.rows);

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});

// =======================
// ANALYTICS
// =======================

app.get("/analytics/:user_id", async (req, res) => {

    const user_id = req.params.user_id;

    try {

        const totalBlogs = await pool.query(
            "SELECT COUNT(*) FROM blogs WHERE user_id=$1",
            [user_id]
        );

        const totalCategories = await pool.query(
            "SELECT COUNT(*) FROM categories"
        );

        const totalComments = await pool.query(
            `SELECT COUNT(*)
             FROM comments c
             JOIN blogs b
             ON c.blog_id=b.blog_id
             WHERE b.user_id=$1`,
            [user_id]
        );

        const totalLikes = await pool.query(
            `SELECT COUNT(*)
             FROM likes l
             JOIN blogs b
             ON l.blog_id=b.blog_id
             WHERE b.user_id=$1`,
            [user_id]
        );

        const totalViews = await pool.query(
            `SELECT COALESCE(SUM(views),0)
             FROM blogs
             WHERE user_id=$1`,
            [user_id]
        );

        const categoryData = await pool.query(

            `SELECT

                c.category_name,

                COUNT(b.blog_id) AS total

             FROM categories c

             LEFT JOIN blogs b
             ON c.category_id=b.category_id
             AND b.user_id=$1

             GROUP BY c.category_name

             ORDER BY c.category_name`,

            [user_id]

        );

        const topBlogs = await pool.query(

            `SELECT

                b.title,

                b.views,

                COUNT(l.like_id) AS likes

             FROM blogs b

             LEFT JOIN likes l
             ON b.blog_id=l.blog_id

             WHERE b.user_id=$1

             GROUP BY b.blog_id

             ORDER BY b.views DESC

             LIMIT 5`,

            [user_id]

        );

        res.json({

            blogs: totalBlogs.rows[0].count,

            categories: totalCategories.rows[0].count,

            comments: totalComments.rows[0].count,

            likes: totalLikes.rows[0].count,

            views: totalViews.rows[0].coalesce,

            categoryData: categoryData.rows,

            topBlogs: topBlogs.rows

        });

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});
// =======================
// GET SINGLE BLOG (PUBLIC)
// Real Time Views
// =======================

app.get("/blog/:id", async (req, res) => {

    const id = req.params.id;

    try {

        // Increase View Count
        await pool.query(
            "UPDATE blogs SET views = views + 1 WHERE blog_id = $1",
            [id]
        );

        // Fetch Blog
        const result = await pool.query(

            `SELECT
                blogs.*,
                categories.category_name
             FROM blogs
             JOIN categories
             ON blogs.category_id = categories.category_id
             WHERE blogs.blog_id = $1`,

            [id]

        );

        res.json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).send("Database Error");

    }

});

// =======================
// USER BLOGS
// =======================

app.get("/user-blogs", async (req,res)=>{

    try{

        const result = await pool.query(

            `SELECT

                blogs.blog_id,

                blogs.title,

                blogs.content,

                categories.category_name

            FROM blogs

            JOIN categories

            ON blogs.category_id=categories.category_id

            ORDER BY blogs.blog_id DESC`

        );

        res.json(result.rows);

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});
app.get("/blog-page", (req,res)=>{

    res.sendFile(
        path.join(__dirname,"views","blog.html")
    );

});

// ======================
// GET SINGLE USER BLOG
// ======================

app.get("/user-blog/:id", async (req, res) => {

    const id = req.params.id;

    try{

        const result = await pool.query(

            `SELECT blogs.*,
                    categories.category_name
             FROM blogs
             JOIN categories
             ON blogs.category_id = categories.category_id
             WHERE blog_id = $1`,

            [id]

        );

        res.json(result.rows[0]);

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});
// =======================
// BLOGS BY CATEGORY
// =======================

app.get("/blogs/category/:id", async (req,res)=>{

    const id = req.params.id;

    try{

        const result = await pool.query(

            `SELECT

                blogs.blog_id,

                blogs.title,

                blogs.content,

                categories.category_name

             FROM blogs

             JOIN categories

             ON blogs.category_id = categories.category_id

             WHERE blogs.category_id = $1

             ORDER BY blogs.blog_id DESC`,

            [id]

        );

        res.json(result.rows);

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});
// ======================
// INCREASE BLOG VIEW
// ======================

app.put("/increase-view/:id", async (req, res) => {

    const id = req.params.id;

    try{

        await pool.query(

            `UPDATE blogs
             SET views = views + 1
             WHERE blog_id = $1`,

            [id]

        );

        res.send("View Updated");

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

}); 
// ======================
// GET BLOG LIKES
// ======================

app.get("/blog-likes/:id", async (req,res)=>{

    const id = req.params.id;

    try{

        const result = await pool.query(

            "SELECT COUNT(*) FROM likes WHERE blog_id=$1",

            [id]

        );

        res.json(result.rows[0]);

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});
// ======================
// ADD LIKE
// ======================

app.post("/like-blog/:id", async(req,res)=>{

    const id = req.params.id;

    try{

        await pool.query(

            "INSERT INTO likes(blog_id,username) VALUES($1,$2)",

            [id,"Guest"]

        );

        res.send("Liked");

    }

    catch(error){

        console.log(error);

        res.status(500).send("Database Error");

    }

});
// =======================
// START SERVER
// =======================

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});