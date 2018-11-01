
前回の記事で[TypeScriptとAngularの開発環境を構築](https://qiita.com/narista/items/500a4afd0bad8620461f)した後、Angular（のチュートリアル）を完全理解したので、いよいよ実装に入ろうとしたらいきなりつまづいてしまいました。親コンポーネントがページ内に持っているタイトルを、子コンポーネントが遷移するたびに表示される子コンポーネントに合わせて更新する方法が分からず右往左往したので解決策をシェアします。

例えば、AppComponentという親コンポーネントがTopというタイトルで、LoginComponentとProcessingComponentの二つの子コンポーネントを持つとします。

このとき、以下のような仕様を実現したかったのですが、app-routing.moduleを使用してコンポーネントの遷移をテンプレート上に直接定義していない場合は、@Outputによる子から親への連携が効かないのです。

| コンポーネント | ページのタイトル | ブラウザのタイトル |
|:-------------|:-------------:|:---------------:|
| AppComponent | Top | Top |
| LoginComponent | Login | Top - Login |
| ProcessingComponent| Processing | Top - Processing |

動作イメージはこちら


Angularのドキュメントでは[コンポーネントの相互作用](https://angular.jp/guide/component-interaction)の章で、親子間のメッセージ連携について@Input、@Outputなどの方法が記載されていますが、子から親へのイベント送信である@Outputは、app.component.thmlテンプレート内で子コンポーネントを直接指定する場合は動作しますが、[ルーティング](https://angular.jp/tutorial/toh-pt5)を使用して動的に子コンポーネントが切り替わる場合には動作しません。

そこで、サービスを介して親子間での連携を実現するしかないのですが、公式ドキュメントに載っているサンプルはちと分かりにくい… 現実には、オブザーバーパターンを利用したパブリッシャー・サブスクライバーモデルで、コンポーネント間の対話を実現するサービスを実装します。このパターンでは、親子関係だけではなく子と子の間であってもパブリッシャーとサブスクライバー間であれば対話を実現できるので、かなり汎用性のあるメッセージ連携を実現できます。

実際に今回使用するサービスは以下の通りです。

```TypeScript:component-interaction.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentInteractionService {

    private subject = new Subject<any>();

    // The event property for the subscribers.
    event$ = this.subject.asObservable();

    // Publish the event to the subscribers.
    publish(change: any) {
        this.subject.next(change);
    }
}
```

イベントを待ち受けするサブスクライバー側（このケースではAppComponentという親コンポーネント）では、以下のコードで発行されるイベントを待ち受けします。

```TypeScript: app.component.ts
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ComponentInteractionService } from 'src/component-interaction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Title]
})

export class AppComponent {
  // The initial vslue of the title.
  baseTitle = 'Top';
  title = this.baseTitle;

  constructor(private pageTitle: Title, private interactionService: ComponentInteractionService) {
    // Subscribe the event from the component interaction service
    this.interactionService.event$.subscribe(text => this.onTitleChanged(text));
  }

  // Sets the title of the browser title bar and the title in the page.
  onTitleChanged(event: string) {
    this.title = event;
    this.pageTitle.setTitle(`${this.baseTitle} - ${event}`);
  }
}
```

一方、イベントを発行する子コンポーネント側（このケースではLoginComponentという子コンポーネント）では、以下のようにDependency Injectionで注入されたサービスに対して、コンポーネントのロード時にタイトルに設定するテキストをイベントとして発行しています。

```TypeScript: login.component.ts
import { Component, OnInit } from '@angular/core';
import { ComponentInteractionService } from 'src/component-interaction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private interactionService: ComponentInteractionService) { }

  ngOnInit() {
    // Publish the title text!
    this.interactionService.publish('Login');
  }

}
```

```bash
# 新しいプロジェクトを作成
$ ng new angular-component-interaction
#　ルーティングモジュールを作成
$ ng generate module app-routing --flat --module=app
# loginとprocessingコンポーネントを作成
$ ng generate component login
$ ng generate component processing
```

作成されたapp-routing.module.tsを以下のように変更。

```TypeScript: app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ProcessingComponent } from './processing/processing.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'processing', component: ProcessingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

app-component.htmlを以下のように変更。

```html: app-component.html
<h1>{{title}}</h1>
<nav>
  <a routerLink="/login">Login</a>
  <a routerLink="/processing">Processing</a>
</nav>
<router-outlet></router-outlet>
```

上記の<router-outlet>部分が実行時に子コンポーネントで置き換えられます。

