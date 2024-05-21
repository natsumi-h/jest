import { User } from "../src/script";
import fetchMock from "jest-fetch-mock";

describe("User", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should fetch user successfully", async () => {
    const userData = {
      attributes: {
        id: 1,
        name: "Sample User",
        account_ids: [1, 2],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(userData));

    const user = await User.fetchUser(1);
    expect(user.id).toBe(1);
    expect(user.name).toBe("Sample User");
    expect(user.account_ids).toEqual([1, 2]);
  });

  it("should handle fetch error", async () => {
    fetchMock.mockRejectOnce(new Error("Failed to fetch"));

    await expect(User.fetchUser(1)).rejects.toThrow("Failed to fetch");
  });

  it("should handle 404 error", async () => {
    fetchMock.mockResponseOnce("", { status: 404 });

    await expect(User.fetchUser(1)).rejects.toThrow(
      "Failed to fetch data: 404"
    );
  });

  it("should fetch user accounts successfully", async () => {
    const userData = {
      attributes: {
        id: 1,
        name: "Sample User",
        account_ids: [1, 2],
      },
    };
    const accountsData = [
      { attributes: { id: "1", user_id: 1, name: "Account 1", balance: 1000 } },
      { attributes: { id: "2", user_id: 1, name: "Account 2", balance: 2000 } },
    ];
    fetchMock.mockResponses(
      [JSON.stringify(userData), { status: 200 }],
      [JSON.stringify(accountsData), { status: 200 }]
    );

    const user = await User.fetchUser(1);
    await user.fetchUserAccounts();
    expect(user.accounts.length).toBe(2);
    expect(user.accounts[0].id).toBe("1");
    expect(user.accounts[1].id).toBe("2");
  });

  it("should handle error fetching user accounts", async () => {
    const userData = {
      attributes: {
        id: 1,
        name: "Sample User",
        account_ids: [1, 2],
      },
    };
    fetchMock.mockResponses(
      [JSON.stringify(userData), { status: 200 }],
      [JSON.stringify({}), { status: 500 }]
    );

    const user = await User.fetchUser(1);
    await expect(user.fetchUserAccounts()).rejects.toThrow(
      "Failed to fetch data: 500"
    );
  });
});
