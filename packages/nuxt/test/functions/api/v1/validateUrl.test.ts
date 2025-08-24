import { describe, expect, it, vi, beforeEach } from "vitest"
import { onRequest } from "../../../../functions/api/v1/validateUrl"

// Mock global fetch
global.fetch = vi.fn()

describe("validateUrl API endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockRequest = (url: string, method: string = "GET") => ({
    request: {
      method,
      url
    }
  }) as any

  const createMockResponse = (retcode: number) => ({
    ok: true,
    json: async () => ({ retcode })
  } as Response)

  describe("HTTP method validation", () => {
    it("should return 405 for non-GET requests", async () => {
      const context = createMockRequest("http://localhost/test", "POST")
      
      const response = await onRequest(context)
      
      expect(response.status).toBe(405)
    })

    it("should accept GET requests", async () => {
      const context = createMockRequest("http://localhost/test?authKey=test&region=test")
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(createMockResponse(0))
      
      const response = await onRequest(context)
      
      expect(response.status).not.toBe(405)
    })
  })

  describe("Parameter validation", () => {
    it("should return 400 when authKey is missing", async () => {
      const context = createMockRequest("http://localhost/test?region=os_usa")
      
      const response = await onRequest(context)
      
      expect(response.status).toBe(400)
    })

    it("should return 400 when region is missing", async () => {
      const context = createMockRequest("http://localhost/test?authKey=test123")
      
      const response = await onRequest(context)
      
      expect(response.status).toBe(400)
    })

    it("should return 400 when both parameters are missing", async () => {
      const context = createMockRequest("http://localhost/test")
      
      const response = await onRequest(context)
      
      expect(response.status).toBe(400)
    })
  })

  describe("API response handling", () => {
    it("should return 500 when upstream API fails", async () => {
      const context = createMockRequest("http://localhost/test?authKey=test&region=test")
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response)
      
      const response = await onRequest(context)
      
      expect(response.status).toBe(500)
    })

    it("should return success response for retcode 0", async () => {
      const context = createMockRequest("http://localhost/test?authKey=test&region=test")
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(createMockResponse(0))
      
      const response = await onRequest(context)
      
      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true
      })
    })

    it("should return authKeyExpired error for retcode -101", async () => {
      const context = createMockRequest("http://localhost/test?authKey=test&region=test")
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(createMockResponse(-101))
      
      const response = await onRequest(context)
      
      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: false,
        errorCode: "authKeyExpired"
      })
    })

    it("should return authKeyInvalid error for retcode -100", async () => {
      const context = createMockRequest("http://localhost/test?authKey=test&region=test")
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(createMockResponse(-100))
      
      const response = await onRequest(context)
      
      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: false,
        errorCode: "authKeyInvalid"
      })
    })

    it("should return tooManyRequests error for retcode -110", async () => {
      const context = createMockRequest("http://localhost/test?authKey=test&region=test")
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(createMockResponse(-110))
      
      const response = await onRequest(context)
      
      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: false,
        errorCode: "tooManyRequests"
      })
    })

    it("should return internal error for unknown retcode", async () => {
      const context = createMockRequest("http://localhost/test?authKey=test&region=test")
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(createMockResponse(-999))
      
      const response = await onRequest(context)
      
      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: false,
        errorCode: "internal"
      })
    })
  })

  describe("Parameter forwarding", () => {
    it("should forward authKey and region parameters correctly", async () => {
      const context = createMockRequest("http://localhost/test?authKey=myAuthKey123&region=os_usa")
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(createMockResponse(0))
      
      await onRequest(context)
      
      expect(fetchMock).toHaveBeenCalledTimes(1)
      const callArgs = fetchMock.mock.calls[0][0]
      // Convert URL object to string if needed
      const urlString = callArgs instanceof URL ? callArgs.toString() : String(callArgs)
      expect(urlString).toContain("authkey=myAuthKey123")
      expect(urlString).toContain("region=os_usa")
    })

    it("should call the correct API endpoint", async () => {
      const context = createMockRequest("http://localhost/test?authKey=test&region=test")
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(createMockResponse(0))
      
      await onRequest(context)
      
      expect(fetchMock).toHaveBeenCalledTimes(1)
      const callArgs = fetchMock.mock.calls[0][0]
      // Convert URL object to string if needed
      const urlString = callArgs instanceof URL ? callArgs.toString() : String(callArgs)
      expect(urlString).toContain("https://public-operation-hkrpg-sg.hoyoverse.com/common/gacha_record/api/getGachaLog")
      expect(urlString).toContain("authkey_ver=1")
      expect(urlString).toContain("game_biz=hkrpg_global")
    })
  })
})