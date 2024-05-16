<script lang="ts" setup>
import img01 from "~/assets/img/gds_feature_help01.webp"
import img02 from "~/assets/img/gds_feature_help02.webp"
import img03 from "~/assets/img/gds_guide01.webp"
import img04 from "~/assets/img/gds_guide02.webp"
</script>

<template>
  <div class="doc-container">
    <h3 class="mt-0">
      同期するとできること
    </h3>
    <p>育成を完了した部分の素材ブックマークを、一括で解除します。</p>
    <v-img :src="img01" />
    <div style="height: 36px" />
    <p>スライダーの初期値が現在のレベルに基づいて動きます。</p>
    <v-img :src="img02" />

    <h3>注意事項</h3>
    <ul>
      <li>キャラの状態が変わったり、「サポートキャラ」もしくは「星海同伴」のキャラクターを変えたりしてから約５分、反映に時間がかかります。</li>
      <li>
        私のサーバーでは、送信されたUID等は一切記録しておりません。内部的には<a
          href="https://march7th.xiaohei.moe/en/resource/mihomo_api.html"
          target="_blank"
        >MiHoMo API</a>を利用しています。
      </li>
    </ul>

    <h3>同期方法</h3>
    <ol>
      <li>
        「巡星ビザ」より、「サポートキャラ」もしくは「星海同伴」にキャラクターを登録します（これら最大4キャラを同時に登録できます）。
        <v-img :src="img03" />
        <v-img :src="img04" />
      </li>
      <li>UIDを本ページに入力、もしくはコピペし、「次へ」をクリックします。</li>
      <li>内容が正しいことを確認し、「インポート」をクリックします。</li>
    </ol>
  </div>
</template>
