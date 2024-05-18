<template>
  <div class="doc-container">
    <section>
      <h2>はじめに</h2>
      <p>
        本プライバシーポリシーは、{{ $t("common.appName") }} (https://hsr.matnote.app、以下「本Webアプリ」)
        において、当サイトの訪問者の個人情報の取扱の方針について示したものとなります。
      </p>
      <p>また、本プライバシーポリシーは本Webアプリにのみ適用されます。</p>
    </section>

    <section>
      <h2>アクセス解析のため収集するデータ</h2>
      <p>
        本Webアプリは、サードパーティー(第三者)サービスである「Google
        Analytics」を利用して本サイトのアクセス解析を行っております。このアクセス解析で送信される情報には、IPアドレス、ブラウザーの種類、デバイスの種類、ユーザーのWebアプリ内での操作アクティビティが含まれます。
      </p>
      <p>
        Google
        Analyticsでは、トラフィックデータの収集のためにクッキー（Cookie）を使用しております。これらの情報はすべて匿名で送信されており、統計化された上で閲覧できるため、個人を特定しうるものではありません。このサービスによって送信された情報はGoogleによって管理されます。Googleのプライバシーポリシーは<a
          href="https://policies.google.com/privacy?hl=ja"
          target="gms-google-privacy"
        >こちら</a>です。
      </p>
      <p>
        Google Analyticsによるデータの保護や、Cookieを利用する仕組みなどに関しては<a
          href="https://support.google.com/analytics/answer/6004245"
          target="gms-google-cookie-use"
        >こちら</a>をご参照ください。
      </p>
    </section>

    <section>
      <h2>広告配信のために使用するデータ</h2>
      <p>
        本Webアプリでは、Google
        Adsenseなどの第三者広告配信サービス(以下「広告サービス」)による広告が表示されることがあります。これらの広告サービスはCookieを使用し、ユーザーが過去に訪れたサイトの情報に基づいてユーザーに適切な広告が配信されるようになっています。
      </p>
      <p>
        Cookieを利用したパーソナライズド広告配信については、Google AdSenseによる広告の場合は<a
          href="https://www.google.com/settings/ads"
          target="_blank"
        >google.com/settings/ads</a>より、もしくは広告サービス全般については<a
          href="http://www.aboutads.info/choices/"
          target="_blank"
        >aboutads.info/choices/</a>(英語)より無効化できます。
      </p>
    </section>

    <section>
      <h2>アカウントサービスのために利用するデータ</h2>
      <p>
        本Webアプリでは、データを同期するサービスを提供しています。その際、ユーザーを識別するためにメールアドレスを収集する場合があります。
      </p>
      <p>
        これらのログインデータはGoogleによって管理され、Googleの責任の下保管されます。いかなる場合にもこれらの情報を第三者と共有したり、他の目的で利用したりすることはありません。
      </p>
    </section>

    <section>
      <h2>本プライバシーポリシーの改定について</h2>
      <p>本プライバシーポリシーは随時改定・追記されます。そのため、当ページを定期的に見直すことをお勧めします。この変更は、このページに掲載された直後に有効になります。</p>
    </section>

    <div class="data">
      最終更新 2023/07/15
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "privacy",
})
</script>
