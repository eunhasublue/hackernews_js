import { NewsFeed, NewsStore } from "./types";

export default class Store implements NewsStore {
  private feeds: NewsFeed[];
  private _currentPage: number;

  constructor() {
    this.feeds = [];
    this._currentPage = 1;
  }

  // 변수명과 함수명이 달라야 하며, 그래서 이렇게 내부에서만 쓰는 것들은 이름이 겹치는 경우에 변수 앞에 _ (언더바)를 많이 붙여 준다.
  // _currentPage는 외부로부터 데이터를 세팅하기도 하잖아요.
  // 이 페이지를 hash 값으로 받으면 store에 있는 currentPage도 이 페이지로 바꿔야죠.
  // 그래서 이런 경우 대입문으로 쓸 수 있게 만들어 주는 게 setter 입니다.
  // 이렇게 get set 을 설정하면 class 외부에서는 마치 이게 속성인 것처럼 대입문으로 세팅도 할 수 있고, 그냥 속성 값으로 읽어 갈 수도 있습니다.
  // 하지만 내부에서는 함수기 때문에, 다른 잘못된 값으로 세팅하거나 혹은 특정한 범위 내의 값으로만 한정시키거나 하는 코드를 여기다가 삽입해서 방어코드를 작성할 수 있다는 거죠.
  get currentPage() {
    return this._currentPage;
  }

  set currentPage(page: number) {
    // if (page <= 0) return; 방어코드 예시
    this._currentPage = page;
  }

  get nextPage(): number {
    return this._currentPage + 1;
  }

  get prevPage(): number {
    return this._currentPage > 1 ? this._currentPage - 1 : 1;
  }
  //set을 작성하지 않으면 대입문으로 값을 넣을 수 없다. 일종의 readonly 속성이 되는 것이다.

  // feed가 전체가 몇 개인지, feed.length를 이용해서, 반복문을 돈다거나 하는게 많았는데, 그런 경우에 feeds.length를 직접 접근하지 않게
  // length를 내보내주는 getter를 하나 제공해 주자.
  get numberOfFeed(): number {
    return this.feeds.length;
  }

  // feed에 데이터가 있다 없다... length가 0이냐 이런거 체크하는 코드이다.
  get hasFeeds(): boolean {
    return this.feeds.length > 0;
  }

  // 전체 feed를 내보내는 메소드
  getAllFeeds(): NewsFeed[] {
    return this.feeds;
  }

  // feed 내에 특정한 위치에 있는 feed 하나를 꺼내 오는 함수
  getFeed(position: number): NewsFeed {
    return this.feeds[position];
  }

  /*
    feed 자체가 이 store에 있으니까
    feed 안에 우리 read 속성 추가하는게 있었잖아요 그렇죠??
    그리고 값을 세팅하는 것도 제공해줘야겠죠.
    feed 전체의 데이터를 api에서 당겨 오면 값을 세팅해야 되잖아요.
    그래서 그 세팅하는 setFeeds라고 메소드를 만들자.
    map 함수를 이용해서 바로 feed에 넣지 않고, 아래처럼
  */
  setFeeds(feeds: NewsFeed[]): void {
    this.feeds = feeds.map((feed) => ({
      ...feed,
      read: false,
    }));
  }

  /*
    NewsDetail을 들어가 보면 특정 id로 값을 읽었으니까.
    우리가 read를 true로 만들어주는 코드를 store를 관장하는 이 store 객체가 제공해 보는 걸로 하죠.
  */
  makeRead(id: number): void {
    const feed = this.feeds.find((feed: NewsFeed) => feed.id === id);
    if (feed) {
      feed.read = true;
    }
  }
}
