"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Account = exports.baseUrl = void 0;
exports.baseUrl = "https://sample-accounts-api.herokuapp.com";
const fetchData = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status}`);
        }
        return res.json();
    }
    catch (error) {
        throw error;
    }
});
// Account Class
class Account {
    constructor(id, user_id, name, balance) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.balance = balance;
    }
    static fetchAccount(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountData = yield fetchData(`${exports.baseUrl}/accounts/${accountId}`);
                return new Account(accountData.attributes.id, accountData.attributes.user_id, accountData.attributes.name, accountData.attributes.balance);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.Account = Account;
// User Class
class User {
    constructor(id, name, account_ids) {
        this.accounts = [];
        this.id = id;
        this.name = name;
        this.account_ids = account_ids;
    }
    static fetchUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield fetchData(`${exports.baseUrl}/users/${userId}`);
                const { id, name, account_ids } = userData.attributes;
                return new User(id, name, account_ids);
            }
            catch (error) {
                throw error;
            }
        });
    }
    fetchUserAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetchData(`${exports.baseUrl}/users/${this.id}/accounts`);
                const accountList = res.map((account) => account.attributes);
                this.accounts = accountList.map((account) => {
                    const { id, name, balance, user_id } = account;
                    const accounts = new Account(id, user_id, name, balance);
                    return accounts;
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fetchUserAccounts();
            return {
                id: this.id,
                name: this.name,
                accounts: this.accounts.map((account) => ({
                    id: account.id,
                    name: account.name,
                    balance: account.balance,
                })),
            };
        });
    }
}
exports.User = User;
function getUserDetails(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User.fetchUser(userId);
            const userInfo = yield user.getUserInfo();
            return userInfo;
        }
        catch (error) {
            console.error("Error fetching user details:", error);
        }
    });
}
// (async () => console.log(await getUserDetails(2)))();
