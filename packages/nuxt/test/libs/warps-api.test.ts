import { describe, expect, it, vi, beforeEach } from "vitest"
import { WarpsApi } from "../../libs/warps-api"

// Mock the global fetch
global.fetch = vi.fn()

// Mock Firebase functions
const mockFunctions = {
  app: {},
  region: vi.fn(),
} as any

// Mock httpsCallable
vi.mock("firebase/functions", () => ({
  httpsCallable: vi.fn(() => vi.fn()),
}))

describe("WarpsApi", () => {
  let warpsApi: WarpsApi
  const validUrl = "https://public-operation-hkrpg-sg.hoyoverse.com/common/gacha_record/api/getGachaLog?authkey=test123&region=os_usa"
  const _invalidUrl = "https://invalid-url.com"

  beforeEach(() => {
    vi.clearAllMocks()
    warpsApi = new WarpsApi(mockFunctions, validUrl)
  })

  describe("constructor", () => {
    it("should create instance with functions and url", () => {
      const api = new WarpsApi(mockFunctions, validUrl)
      expect(api).toBeDefined()
      expect(api.currentTicket).toBeUndefined()
    })
  })

  describe("validateUrl", () => {
    it("should return invalid for malformed URL", async () => {
      const api = new WarpsApi(mockFunctions, "invalid-url")
      const result = await api.validateUrl()

      expect(result).toEqual({
        valid: false,
        errorCode: "invalidUrl",
      })
    })

    it("should return invalid when authkey is missing", async () => {
      const urlWithoutAuthkey = "https://public-operation-hkrpg-sg.hoyoverse.com/common/gacha_record/api/getGachaLog?region=os_usa"
      const api = new WarpsApi(mockFunctions, urlWithoutAuthkey)

      const result = await api.validateUrl()

      expect(result).toEqual({
        valid: false,
        errorCode: "invalidUrl",
      })
    })

    it("should return invalid when region is missing", async () => {
      const urlWithoutRegion = "https://public-operation-hkrpg-sg.hoyoverse.com/common/gacha_record/api/getGachaLog?authkey=test123"
      const api = new WarpsApi(mockFunctions, urlWithoutRegion)

      const result = await api.validateUrl()

      expect(result).toEqual({
        valid: false,
        errorCode: "invalidUrl",
      })
    })

    it("should return unknown error when fetch fails", async () => {
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      const result = await warpsApi.validateUrl()

      expect(result).toEqual({
        valid: false,
        errorCode: "unknown",
      })

      expect(fetchMock).toHaveBeenCalledWith("/api/v1/validateUrl?authKey=test123&region=os_usa")
    })

    it("should return valid result when API responds successfully", async () => {
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      const result = await warpsApi.validateUrl()

      expect(result).toEqual({
        valid: true,
        errorCode: undefined,
      })

      expect(fetchMock).toHaveBeenCalledWith("/api/v1/validateUrl?authKey=test123&region=os_usa")
    })

    it("should return invalid with error code when API responds with error", async () => {
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, errorCode: "authKeyExpired" }),
      } as Response)

      const result = await warpsApi.validateUrl()

      expect(result).toEqual({
        valid: false,
        errorCode: "authKeyExpired",
      })

      expect(fetchMock).toHaveBeenCalledWith("/api/v1/validateUrl?authKey=test123&region=os_usa")
    })
  })

  describe("createTicket", () => {
    it("should throw error when authkey is missing", async () => {
      const urlWithoutAuthkey = "https://public-operation-hkrpg-sg.hoyoverse.com/common/gacha_record/api/getGachaLog?region=os_usa"
      const api = new WarpsApi(mockFunctions, urlWithoutAuthkey)

      await expect(api.createTicket({}, false)).rejects.toThrow("Insufficient parameters")
    })

    it("should throw error when region is missing", async () => {
      const urlWithoutRegion = "https://public-operation-hkrpg-sg.hoyoverse.com/common/gacha_record/api/getGachaLog?authkey=test123"
      const api = new WarpsApi(mockFunctions, urlWithoutRegion)

      await expect(api.createTicket({}, false)).rejects.toThrow("Insufficient parameters")
    })

    it("should create ticket successfully", async () => {
      const { httpsCallable } = await import("firebase/functions")
      const mockCallable = vi.fn().mockResolvedValueOnce({
        data: { ticket: "test-ticket-123" },
      })

      vi.mocked(httpsCallable).mockReturnValueOnce(mockCallable)

      const lastIds = { 11: "123", 12: "456" }
      const untilLatestRare = true

      await warpsApi.createTicket(lastIds, untilLatestRare)

      expect(httpsCallable).toHaveBeenCalledWith(mockFunctions, "dispatchGetWarpHistory")
      expect(mockCallable).toHaveBeenCalledWith({
        authKey: "test123",
        region: "os_usa",
        lastIds,
        untilLatestRare,
      })
      expect(warpsApi.currentTicket).toBe("test-ticket-123")
    })
  })
})
