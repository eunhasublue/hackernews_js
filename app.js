const container = document.getElementById("root");
const ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

// 여러 함수에 걸쳐서 접근하게 되는 정보는 함수 바깥쪽으로 빼놓는 것이 필요하다.
// 공유되는 자원
const store = {
  currentPage: 1,
};

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  newsList.push("<ul>");

  // store.currentPage = 1 -> 0~9 목록 / 2 -> 10~19 목록
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
  <li>
    <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title} (${newsFeed[i].comments_count})</a>
  </li>
`);
  }
  newsList.push("</ul>");

  // 내비게이션 UI 만들기
  // 라우터 관점에서 글 내용을 보는 해시인지, 글 페이지를 하는 해시인지 구분이 필요함. (page)
  // 방어 코드 작성
  // 1. 페이지가 1페이지에서 0페이지로 가버리기 때문에 삼항 연산자로 막음
  newsList.push(`
  <div>
    <a href="#/page/${
      store.currentPage > 1 ? store.currentPage - 1 : 1
    }">이전 페이지</a>
    <a href="#/page/${store.currentPage + 1}">다음 페이지</a>
  </div>
`);

  container.innerHTML = newsList.join("");
}

function newsDetail() {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace("@id", id));
  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `;
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

// indexOf
// 1. 입력으로 주어지는 문자열을 찾아서, 있으면 0 이상의 위치 값을 리턴
// 2. 없다면 -1 을 리턴함
