const container = document.getElementById("root");
const ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const store = {
  currentPage: 1,

  // 1. read data를 매번 읽지 않을려면, 한번 읽으면 저장하고 있으면 됨
  // 2. 그 저장한 데이터에다가 우리가 필요로 한 상태를 추가해 놓으면 됨
  // 3. read data는 글을 읽었을 때도 참조해야 되고, 글 목록에서도 참조해야 되닌간 전역상태여야 함.
  // 4. 그런 용도로 store 전역 상태를 만들어 놓은 것임
  // 5. feed를 언제 처음 읽게 될 것인가 -> newsFeed 함수가 호출될 때 처음 읽게 됨
  // 6. getData 네트워크를 통해서 가져오는 데이터를 newsFeed를 store.feed로 교체
  feeds: [],
};

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

// 새로 불러온 newsFeed에 읽었냐 안 읽었냐 라고 하는 상태를 추가해야함.
function makeFeeds(feeds) {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }
  return feeds;
}

function newsFeed() {
  // const newsFeed = getData(NEWS_URL);
  let newsFeed = store.feeds;
  const newsList = [];

  // 7. 처음엔 빈 배열이기 때문에, 최초의 한번은 getData해서 가져와야함.
  // 8. 목록을 만들기 전에 체크
  // 같은 데이터를 연속적으로 넣어줄 수 있음.
  if (newsFeed.length === 0) {
    // 9. makeFeeds 를 가지고 getData를 한번 감싸주면, 결국 getData가 넘겨준 데이터가 makeFeeds로 가고
    //    makeFeeds가 read라는 속성을 추가한 데이터를 넘겨줌
    newsFeed = store.feeds = makeFeeds(getData(NEWS_URL));
  }

  let template = `
        <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                  Previous
                </a>
                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                  Next
                </a>
              </div>
            </div> 
          </div>
        </div>
        <div class="p-4 text-2xl text-gray-700">
          {{__news_feed__}}        
        </div>
      </div>
  `;

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
    <div class="p-6 ${
      newsFeed[i].read ? "bg-red-500" : "bg-white"
    } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
    <div class="flex">
      <div class="flex-auto">
        <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
      </div>
      <div class="text-center text-sm">
        <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
          newsFeed[i].comments_count
        }</div>
      </div>
    </div>
    <div class="flex mt-3">
      <div class="grid grid-cols-3 text-sm text-gray-500">
        <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
        <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
        <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
      </div>  
    </div>
  </div>
    `);
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    store.currentPage + 1 ? store.currentPage - 1 : 1
  );
  template = template.replace("{{__next_page__}}", store.currentPage + 1);

  container.innerHTML = template;
}

function newsDetail() {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace("@id", id));
  let template = `
  <div class="bg-gray-600 min-h-screen pb-8">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/${store.currentPage}" class="text-gray-500">
              <i class="fa fa-times"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="h-full border rounded-xl bg-white m-6 p-4 ">
      <h2>${newsContent.title}</h2>
      <div class="text-gray-400 h-20">
        ${newsContent.content}
      </div>
    {{__comments__}}
  </div>
  `;

  // 읽음 처리 표시
  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  function makeComment(comments, called = 0) {
    const commentString = [];

    for (let i = 0; i < comments.length; i++) {
      commentString.push(`
        <div style="padding-left: ${called * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>
      `);

      if (comments[i].comments.length > 0) {
        commentString.push(makeComment(comments[i].comments, called + 1));
      }
    }
    return commentString.join("");
  }

  container.innerHTML = template.replace(
    "{{__comments__}}",
    makeComment(newsContent.comments)
  );
}

function router() {
  const routerPath = location.hash;
  if (routerPath === "") {
    newsFeed();
  } else if (routerPath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routerPath.substring(7));
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router);

router();
