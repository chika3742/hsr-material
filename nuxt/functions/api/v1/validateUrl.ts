import type {GetWarpHistoryErrorCode} from "~/../firebase/functions/src/types/shared/get-warp-history-error"

export const onRequest: PagesFunction = async(context) => {
  if (context.request.method !== "GET") {
    return new Response(null, {
      status: 405,
    })
  }
  const reqUrl = new URL(context.request.url)
  if (!reqUrl.searchParams.has("authKey") || !reqUrl.searchParams.has("region")) {
    return new Response(null, {
      status: 400,
    })
  }

  const endpoint = "https://api-os-takumi.mihoyo.com/common/gacha_record/api/getGachaLog"
  const params = {
    authkey_ver: "1",
    sign_type: "2",
    auth_appid: "webview_gacha",
    lang: "ja",
    game_biz: "hkrpg_global",
    size: "20",
    authkey: reqUrl.searchParams.get("authKey"),
    region: reqUrl.searchParams.get("region"),
    gacha_type: "11",
    end_id: "0",
  }

  const url = new URL(endpoint)
  url.search = new URLSearchParams(params).toString()

  const fetchResult = await fetch(url)

  if (!fetchResult.ok) {
    return new Response(null, {
      status: 500,
    })
  }

  const result = await fetchResult.json<{ retcode: number }>()

  const response: { success: boolean, errorCode?: GetWarpHistoryErrorCode } = (() => {
    switch (result.retcode) {
      case 0:
        return {
          success: true,
        }
      case -101:
        return {
          success: false,
          errorCode: "authKeyExpired",
        }
      case -100:
        return {
          success: false,
          errorCode: "authKeyInvalid",
        }
      case -110:
        return {
          success: false,
          errorCode: "tooManyRequests",
        }
      default:
        return {
          success: false,
          errorCode: "internal",
        }
    }
  })()

  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
