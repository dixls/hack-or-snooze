"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <small class="story-fav"><a href="#">add favorite</a></small>
        <small class="story-unfav hidden"><a href="#">remove favorite</a></small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitStory(evt) {
  evt.preventDefault();
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();
  if (!author || !title || !url) return;
  const newStory = await storyList.addStory(currentUser, {author, title, url});
  // console.log(newStory);
  navAllStories();
}

$storyForm.on("submit", submitStory)

function favClickHandler (evt) {
  const $parent = $(evt.target).parent()
  const storyId = $parent.parent().attr('id')
  currentUser.addFavorite(storyId);
  $parent.toggleClass('hidden')
  console.log($parent.parent().find(".story-unfav"))
}

$allStoriesList.on("click", ".story-fav", favClickHandler);