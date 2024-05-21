

export const baseUrl = "https://sample-accounts-api.herokuapp.com";

const fetchData = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    throw error;
  }
};

// Account Class
export class Account {
  id: string;
  user_id: number;
  name: string;
  balance: number;

  constructor(id: string, user_id: number, name: string, balance: number) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.balance = balance;
  }

  static async fetchAccount(accountId: number) {
    try {
      const accountData = await fetchData(`${baseUrl}/accounts/${accountId}`);
      return new Account(
        accountData.attributes.id,
        accountData.attributes.user_id,
        accountData.attributes.name,
        accountData.attributes.balance
      );
    } catch (error) {
      throw error;
    }
  }
}

// User Class
export class User {
  id: number;
  name: string;
  account_ids: number[];
  accounts: Account[] = [];

  constructor(id: number, name: string, account_ids: number[]) {
    this.id = id;
    this.name = name;
    this.account_ids = account_ids;
  }

  static async fetchUser(userId: number) {
    try {
      const userData = await fetchData(`${baseUrl}/users/${userId}`);
      const { id, name, account_ids } = userData.attributes;
      return new User(id, name, account_ids);
    } catch (error) {
      throw error;
    }
  }

  async fetchUserAccounts() {
    try {
      const res = await fetchData(`${baseUrl}/users/${this.id}/accounts`);
      const accountList = res.map(
        (account: { attributes: Account }) => account.attributes
      );
      this.accounts = accountList.map((account: Account) => {
        const { id, name, balance, user_id } = account;
        const accounts = new Account(id, user_id, name, balance);
        return accounts;
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserInfo() {
    await this.fetchUserAccounts();
    return {
      id: this.id,
      name: this.name,
      accounts: this.accounts.map((account) => ({
        id: account.id,
        name: account.name,
        balance: account.balance,
      })),
    };
  }
}

async function getUserDetails(userId: number) {
  try {
    const user = await User.fetchUser(userId);
    const userInfo = await user.getUserInfo();
    return userInfo;
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
}

// (async () => console.log(await getUserDetails(2)))();
