"use strict";
// import Data from "./data.json";
const commentsList = document.querySelector(".comments-list");
const userEdit = document.querySelector(".user-edit");
const commentContainer = document.querySelector(".single-comment");

////////////////
const dynamicHTML = function (element, activeUser) {
  const replyingTo = `<span class="replying-to">@${element.replyingTo} </span>`;
  const regularHeaderMarkUp = `
    <div class="header-left">
      <div class="user-avatar">
        <img
          src=${element.user.image.png}
          alt="user-avatar"
        />
      </div>
      <div class="user-name">${element.user.username}</div>
      <div class="date-created">${element.createdAt}</div>
    </div>
    <div class="header-right header-reply" data-reply-to="@${element.user.username}.  ">
    <img src="./images/icon-reply.svg" alt="img-reply" />
      <div class="call-action reply" >Reply</div>
    </div>`;
  const userHeaderMarkUp = `
    <div class="header-left">
      <div class="user-avatar">
        <img
          src=${element.user.image.png}
          alt="user-avatar"
        />
      </div>
      <div class="user-name">${element.user.username}<span>you</span></div>
      <div class="date-created">${element.createdAt}</div>
    </div>
    <div class="header-right user-edit">
              <div class="delete">
                <img src="./images/icon-delete.svg" alt="" />
                <div class="call-action delete">Delete</div>
              </div>
              <div class="edit">
                <img src="./images/icon-edit.svg" alt="img-edit" />
                <div class="call-action edit">Edit</div>
              </div>
          </div>`;
  const updateBtn = `<button class="button update-btn">UPDATE</button>`;
  const userContentMarkUp = `<section class="comment-content">
    ${element.replyingTo ? replyingTo + element.content : element.content}
  </section>
  `;

  const singleMsgHTML = `<div class="likes-container">
    <img src="./images/icon-plus.svg" alt="img-plus" />
  <div class="msg-score">${element.score}</div>
  <img src="./images/icon-minus.svg" alt="img-minus" />
</div>
  ${
    activeUser === element.user.username
      ? userHeaderMarkUp
      : regularHeaderMarkUp
  }
  ${userContentMarkUp}`;
  return singleMsgHTML;
};

const newComment = function (
  activeUserImg = "",
  userToReply = "",
  btn = "SEND"
) {
  const htmlMarkup = `<section class="single-comment new-msg">
  <div class="user-avatar">
    <img
      src=${activeUserImg}
      alt="user-avatar"
      width="35"
    />
  </div>
  <div
    class="new-content msg-editable"
    contenteditable="true"
    data-placeholder=" Add a comment..."
  >
    ${userToReply} 
  </div>
  <button class="button send-btn">${btn}</button>
</section>`;
  return htmlMarkup;
};

const renderComments = function (data) {
  console.log(data);
  const { currentUser, comments } = data;
  const activeUser = currentUser.username;

  comments.map((item) => {
    const divSingleMsg = document.createElement("div");
    divSingleMsg.classList = "single-comment";
    divSingleMsg.setAttribute("data-active-user", activeUser);
    divSingleMsg.setAttribute("data-active-user-img", currentUser.image.png);
    divSingleMsg.innerHTML = dynamicHTML(item, activeUser);
    commentsList.appendChild(divSingleMsg);

    if (item.replies.length > 0) {
      const sectionReply = document.createElement("section");
      sectionReply.classList = "section-reply";
      commentsList.appendChild(sectionReply);

      item.replies.map((reply) => {
        const divSingleMsg = document.createElement("div");
        divSingleMsg.classList = "single-comment reply-msg";
        divSingleMsg.setAttribute("data-active-user", activeUser);
        divSingleMsg.setAttribute(
          "data-active-user-img",
          currentUser.image.png
        );
        divSingleMsg.innerHTML = dynamicHTML(reply, activeUser);
        sectionReply.appendChild(divSingleMsg);
        // sectionReply.innerHTML = '';
      });
    }
  });

  // Adding New Comment Container at the end
  const newMsg = newComment(currentUser.image.png, "", "SEND");
  commentsList.insertAdjacentHTML("beforeend", newMsg);
};
// ///////// EVENT LISTENERS ////////////
const addEventListeners = function () {
  commentsList.addEventListener("click", (event) => {
    // console.log(event.target);
    if (event.target.closest(".user-edit")) {
      const parent = event.target.closest(".single-comment");
      console.log(parent);
      console.log("BINGO!!!!");
      const updateBtn = document.createElement("button");
      updateBtn.classList = "button update-btn";
      updateBtn.innerText = "UPDATE";
      parent.appendChild(updateBtn);
    } else if (event.target.closest(".header-right.header-reply")) {
      const parent =
        event.target.parentElement.parentElement.closest(".single-comment");
      const userToReply = `${
        event.target.closest(".header-reply").dataset.replyTo
      }  `;
      const activeUserImg = parent.dataset.activeUserImg;

      const newReply = newComment(activeUserImg, userToReply, "REPLY");
      parent.insertAdjacentHTML("afterend", newReply);
    }
  });
};

// Fetching the data and calling the render function
const getJSON = fetch("./data.json").then((response) =>
  response.json().then((data) => {
    renderComments(data);
    addEventListeners();
    newComment();
  })
);

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
});
