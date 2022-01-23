const container = document.getElementById("root");
const ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  newsList.push("<ul>");

  for (let i = 0; i < 10; i++) {
    newsList.push(`
  <li>
    <a href="#${newsFeed[i].id}">${newsFeed[i].title} (${newsFeed[i].comments_count})</a>
  </li>
`);
  }
  newsList.push("</ul>");
  container.innerHTML = newsList.join("");
}

function newsDetail() {
  const id = location.hash.substr(1);
  const newsContent = getData(CONTENT_URL.replace("@id", id));
  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#">목록으로</a>
    </div>
  `;
}

function router() {
  const routerPath = location.hash;
  // location.hash에서 #만 들어올때는 true로 반환한다.
  if (routerPath === "") {
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router); //newsDetail);

// 글 목록이 보일려면 router 호출
router();

// const newsFeed = getData(NEWS_URL);
// const ul = document.createElement("ul");

// 글 내용 보여주는 함수는 addEventListener 함수에 묶여 있기 때문에 다른데서 호출할 수가 없엇 빼내야 한다.
// window.addEventListener("hashchange", function () {
//   const id = location.hash.substr(1);
//   const newsContent = getData(CONTENT_URL.replace("@id", id));
//   const title = document.createElement("h1");

//   container.innerHTML = `
//     <h1>${newsContent.title}</h1>
//     <div>
//       <a href="#">목록으로</a>
//     </div>
//   `;
// });

// const newsList = [];
// newsList.push("<ul>");
// for (let i = 0; i < 10; i++) {
//   newsList.push(`
//   <li>
//     <a href="#${newsFeed[i].id}">${newsFeed[i].title} (${newsFeed[i].comments_count})</a>
//   </li>
// `);
// }
// newsList.push("</ul>");
// container.innerHTML = newsList.join("");
