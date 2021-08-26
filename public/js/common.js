$("#postTextArea").keyup(event=>{
    var textbox = $(event.target);
    var value = textbox.val().trim();
    // console.log(value); 
    var btn = $("#submitPostButton");
    if(btn.length == 0)return alert("no submit button found");
    if(value == ""){
        btn.prop("disabled",true);
        return
    }
    btn.prop("disabled",false);
})

//to submit the and make a post request to the api/server
$("#submitPostButton").click((event)=>{
    var btn = $(event.target);
    var text = $("#postTextArea");  

    var data = {
        content:text.val()
    }

    $.post("/api/posts",data,async(postData)=>{
        console.log(postData);
        //after adding to the db we will render the post in the home page
        var html = createHtml(postData);
        $(".postsContainer").prepend(html);
        text.val(""); 
        btn.prop("disabled",true);
    }) 
})


// $(document).on("click", ".post", (event) => {
//     console.log(event);
//     var element = $(event.target);
//     console.log(element);
//     var postId = getPostIdFromElement(element);
//     console.log(postId);
//     if(postId !== undefined && !element.is("button")) {
//         window.location.href = '/post/' + postId;
//     }
// });

$("#deletePostModal").on("show.bs.modal",(event)=>{
    var btn = $(event.relatedTarget);
    var postId = getPostIdFromElement(btn)

    $("#deletePostButton").data("id",postId);
    console.log($("#deletePostButton").data().id);
})

$("#deletePostModal").click((event)=>{
    var postId = $(event.target).data("id");
    console.log(postId);
    $.ajax({
        url: `/api/posts/${postId}`,
        type:"DELETE",
        success:()=>{
            location.reload();
        }
    })
})

$(document).on("click", ".followButton", (event) => {
    var button = $(event.target);
    var userId = button.data().user; 
    console.log(userId);

    $.ajax({
        url: `/api/users/${userId}/follow`,
        type:"PUT",
        success:(Data,status,xhr)=>{
            if(xhr.status == 404){
                alert('user not found');
                return;
            }
            var  diff = 1;
            if(Data.following && Data.following.includes(userId)){
                button.addClass("following");
                button.text("Following")
            }else{
                button.removeClass("following");
                button.text("Follow")
                diff = -1;
            }

            var followersLabel =  $("#followersValue");
            if(followersLabel.length != 0){
                followersText = followersLabel.text();
                count = parseInt(followersText);
                followersLabel.text(count+diff);
            }
        }
    })
});

function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post");
    
    var rootElement = isRoot == true ? element : element.closest(".post");
    var postId = rootElement.data().id;
    if(postId === undefined) return alert("Post id undefined");
    return postId;
}

function outputPosts(results, container) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}

function createHtml(postData){
    var postedby = postData.postedBy; 

    if(postedby === undefined){
        alert("User object not populated");
        return;
    }

    var timestamp = timeDifference(new Date(),new Date(postData.createdAt));
    var button =""
    // if(postData.postedBy._id == userLoggedIn._id){
        button = `<button data-id = "${postData.id}" data-toggle="modal" data-target = "#deletePostModal"><i class="fas fa-times"></i></button>`;
    // }

    return `<div class ='post' data-id='${postData._id}'>
                <div class = 'mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src =${postedby.profilePic}>
                    </div>
                    <div class='PostContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedby.username}'>${postedby.firstName} ${postedby.lastName}</a>
                            <span class='username'>@${postedby.username}</span>
                            <span class ='date'>${timestamp}</span>
                            ${button}
                        </div>
                        <div class = 'postBody'>
                            <span class='content'>${postData.content}</span>
                        </div>
                        <div class = 'postFooter'>
                            
                        </div>
                    </div>
                </div>
            `
}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now";
        
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
} 