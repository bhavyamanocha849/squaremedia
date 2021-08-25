$(document).ready(() => {
    // alert("hello");
    $.get("/api/posts", results => {
        outputPosts(results, $(".postsContainer"));
    })
})