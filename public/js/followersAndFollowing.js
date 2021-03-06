$(document).ready(()=>{
    if(selectedTab === "followers"){
        loadFollowers();
    }else{
        loadFollowing();
    }
})

// var userLoggedIn;
// function getUserLoggedIn(){
//     $.get(`/api/users/current`,user=>{
//         username = user;
//         // console.log("uu",userLoggedIn)
//     });
// }

function loadFollowers(){
    $.get(`/api/users/${profileUserId}/followers`,results=>{
        outputUsers(results.followers,$(".resultsContainer"))
    })
}

function loadFollowing(){
    $.get(`/api/users/${profileUserId}/following`,results=>{
        outputUsers(results.following,$(".resultsContainer"))
    })
}

function outputUsers(results,container){
    container.html("");
    console.log(results);
    results.forEach(result=>{
        // console.log("ss",result);
        var html = createFollowerHtml(result,true)
        container.append(html);
    })

    if(results.length == 0){
        container.append("<span class = 'noResults'>No results found</span>")
    }
}

function createFollowerHtml(userData,showFollowButton){
    
    var name = userData.firstName + userData.lastName;
    var isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id)

    var text = isFollowing ? "Following":"Follow"
    var buttonClass = isFollowing ? "followButton following" : "followButton";
    var followButton = "";
    if(showFollowButton && userLoggedIn._id !== userData._id)  {
        followButton = `<div class='followButtonContainer'>
                            <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
                        </div>`;
    }


    return `<div class='user'>
                <div class ='userImageContainer'> 
                    <img src = '${userData.profilePic}'>
                </div>
                <div class = 'userDetailsContainer'>
                    <div class='header'>
                        <a href = '/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}</span>
                    </div>
                </div> 
                ${followButton}
            </div>`
}