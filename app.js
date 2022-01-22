const container = document.getElementById("root");
const ajax = new XMLHttpRequest();
const content = document.createElement("div"); //id 클릭 후 상세화면 만들려는 영역
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";

// 화면 전환을 하기 위해서는 해당 타이틀의 고유 id 값이 필요하다.
// 어던 타이틀을 클릭했느냐에 따라 id가 달라지기 때문에 일단 @id.json으로 marking만 해놓는다.
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

ajax.open("GET", NEWS_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);
const ul = document.createElement("ul");

// 1번재 인자 : hashchange
// 2번째 인자 : function(){}
// function을 주는 이유는 js의 특징 중 하나가 함수 자체를 값으로 취급해서 이렇게 함수한테 전달을 할 수도 있고
// 함수 자체를 실행할 수도 있음
window.addEventListener("hashchange", function () {
  // hash change가 일어났을 때 어떻게 하면 id를 알 수 있을까?
  // lcation 객체가 있음 -> 주소와 관련된 다양한 정보들을 제공해 준다.
  // substr : 내가 쓰고 싶은 위치 값만 지정해 주면 그 이후부터의 값까지 쓴다.
  // 1번째 위치부터 나머미 뒤에 있는 문자열들만 반환해준다.
  const id = location.hash.substr(1);

  // #을 제거하고 CONTENT_URL에 @id를 id 변수로 바꿔주기 위해서 replace를 쓴다
  // @id를 id 변수로 대체해준다.
  ajax.open("GET", CONTENT_URL.replace("@id", id), false);
  ajax.send();
  const newsContent = JSON.parse(ajax.response);
  const title = document.createElement("h1");

  title.innerHTML = newsContent.title;
  content.appendChild(title);
});

for (let i = 0; i < 10; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = `#${newsFeed[i].id}`; // #만 있으면 경로가 변경되지 않기 때문에 그 옆에 id를 넣어줘야 한다.
  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;
  // a.addEventListener("click", function(){})
  li.appendChild(a);
  ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);

// 사용자가 타이틀을 클랙했을 때, 저 CONTENT_URL을 가지고 ajax 호출해서 data를 가져오면 됨.
// 어떻게 클릭했는지 알 수 있을까? -> 이벤트가 있음
// 예를 들면, js는 사용자가 해당 버튼을 언제 클릭할지 알 수가 없기 때문에,
// 이것과 관련된 시트템을 브라우저가 제공을 해줌 -> 이 시스템을 이벤트 시스템이라고 한다.
// 제공을 어떻게 하느냐
//  - js 코드에서 어떤 UI 요소가 어떤 이벤트가 발생했을 때, 내가 "어떤 함수 좀 호출해 줘" 라고 코드로 기술하고 브라우저에 요청한다.

// a 태그에 #을 넣어놨음 이 #을 우리가 해시라고 함 -> 일종의 북마크
// 페이지 내에서 어떤 a 태그의 이름
// name이라고 하는 속성과 같은 해시 이름이 들어오면, 그 위치로 바로 스크롤링 되게 만든 기능
// 위 기능을 응용해서, 이 해시가 어떤 이름으로 바뀌었을 때, 이벤트가 발생함
// 그 해시가 바뀐 이벤트가 hash change 라고 하는 이벤트 이름임.
// hash change가 일어났다는 얘기는 현재 여기서 우리가 #를 가지고 북마크로 사용하진 않고,
// 그걸 이용해서 어떤 링크, 어떤 타이틀이 클릭됐구나 하고 생각을 해보죠.
// 그러면 그 hash change 이벤트를 가지고 한 전만 등록해 놓고 사용을 해볼 수 있다.
// hash change는 window 라고 하는 객체에서 발생한다.
