import { Account } from "../src/script";
import fetchMock from "jest-fetch-mock";

describe("Account", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should fetch account successfully", async () => {
    const accountData = {
      attributes: {
        id: "1",
        user_id: 1,
        name: "Sample Account",
        balance: 1000,
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(accountData));

    const account = await Account.fetchAccount(1);
    expect(account.id).toBe("1");
    expect(account.user_id).toBe(1);
    expect(account.name).toBe("Sample Account");
    expect(account.balance).toBe(1000);
  });

  it("should handle fetch error", async () => {
    fetchMock.mockRejectOnce(new Error("Failed to fetch"));

    await expect(Account.fetchAccount(1)).rejects.toThrow("Failed to fetch");
  });

  it("should handle 404 error", async () => {
    fetchMock.mockResponseOnce("", { status: 404 });

    await expect(Account.fetchAccount(1)).rejects.toThrow(
      "Failed to fetch data: 404"
    );
  });
});
